export default async function MemberIdPage(props: { params: { memberId: string}}) {
    return <div>{props.params.memberId}</div>
}
