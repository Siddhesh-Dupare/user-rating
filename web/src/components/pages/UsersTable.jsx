import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "role", header: "Role" },
];

export default function UsersTable({ onBack }) {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams(filters);

    async function loadUsers() {
      try {
        setError("");
        const response = await fetch(
          `http://localhost:5000/api/admin/users?${query}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Unable to load users");
        }
        setUsers(result.users);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      }
    }

    loadUsers();
    return () => controller.abort();
  }, [filters]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Users</CardTitle>
        <Button variant="outline" onClick={onBack}>
          Back to dashboard
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Filter by name" value={filters.name} onChange={(event) => updateFilter("name", event.target.value)} />
          <Input placeholder="Filter by email" value={filters.email} onChange={(event) => updateFilter("email", event.target.value)} />
          <Input placeholder="Filter by address" value={filters.address} onChange={(event) => updateFilter("address", event.target.value)} />
          <Input placeholder="Filter by role" value={filters.role} onChange={(event) => updateFilter("role", event.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((listedUser) => (
                <TableRow key={listedUser.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {listedUser[column.accessorKey] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
