export default async function ServerIdPage({ params }: { params: { serverId: string } }) {
    return (
        <div className="text-left sm:text-center">{params.serverId}</div>
    )
}