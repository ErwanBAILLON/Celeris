import { useGetUsersQuery } from "../../slice/apiSlice";

const Home = () => {

  const { data, error, isLoading } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error loading users</p>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Users</h2>
      <ul className="mt-3">
        {data?.map((user) => (
          <li key={user.id} className="p-2 border-b border-gray-300">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;