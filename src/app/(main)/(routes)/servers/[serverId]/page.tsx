export default async function ServerIdPage({ params }: { params: { serverId: string } }) {
    return (
        <div>{params.serverId}</div>
    )
}