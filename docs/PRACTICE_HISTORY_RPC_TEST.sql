-- Test-only atomic RPC, SECURITY INVOKER preserves ownership RLS.
create or replace function public.save_practice_result(p_mode text,p_completed_at timestamptz,p_attempts jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare v_id uuid; v_count integer;
begin
 if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
 if p_mode not in ('free','diagnostic','weak','daily','recommended') then raise exception 'Invalid mode'; end if;
 if p_completed_at is null or p_completed_at > now() + interval '5 minutes' then raise exception 'Invalid completion time'; end if;
 if jsonb_typeof(p_attempts) is distinct from 'array' or jsonb_array_length(p_attempts) <> 5 then raise exception 'Exactly five attempts required'; end if;
 insert into public.practice_sessions(user_id,mode,completed_at)
 values ((select auth.uid()),p_mode,p_completed_at) returning id into v_id;
 insert into public.practice_attempts(session_id,user_id,position,type_id,correct,duration_ms)
 select v_id,(select auth.uid()),ord::smallint, item->>'typeId',
        (item->>'correct')::boolean,(item->>'durationMs')::integer
 from jsonb_array_elements(p_attempts) with ordinality as t(item,ord);
 get diagnostics v_count = row_count;
 if v_count <> 5 then raise exception 'Incomplete attempts'; end if;
 return v_id;
end $$;
revoke all on function public.save_practice_result(text,timestamptz,jsonb) from public,anon;
grant execute on function public.save_practice_result(text,timestamptz,jsonb) to authenticated;
