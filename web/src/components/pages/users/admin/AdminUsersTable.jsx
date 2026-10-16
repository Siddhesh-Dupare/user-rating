import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import DirectoryTable from "./DirectoryTable";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "role", label: "Role" },
];

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load users");
        }

        setUsers(result.users);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();
    return () => controller.abort();
  }, []);

  return (
    <DirectoryTable
      rows={users}
      columns={columns}
      title="User directory"
      description="Manage users and administrators"
      icon={Users}
      searchPlaceholder="Search users..."
      emptyMessage="No users found."
      error={error}
      isLoading={isLoading}
    />
  );
}
