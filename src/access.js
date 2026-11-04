// 009: UI capability hints only. Database RLS remains the security boundary.
export function accountCapabilities({userId=null,hasStudentProfile=false,hasLinkedChildren=false}={}){
 const signedIn=typeof userId==='string'&&userId.length>0;
 return Object.freeze({signedIn,canEditStudentProfile:signedIn,canIssueStudentCode:signedIn&&hasStudentProfile,canRedeemParentCode:signedIn,canViewLinkedChildren:signedIn&&hasLinkedChildren});
}
export function canAccessAccountRoute(session){return !!session?.user?.id;}
export function sessionIdentity(session){return session?.user?.id||null;}
