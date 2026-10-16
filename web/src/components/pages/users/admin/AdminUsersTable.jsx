import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Search,
  Users,
} from "lucide-react";

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
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "role", label: "Role" },
];

function getInitials(name) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function getRoleStyles(role) {
  if (role === "ADMIN") {
    return "bg-[#6842f5]/20 text-[#c4b5fd] ring-[#6842f5]/30";
  }

  if (role === "STORE_OWNER") {
    return "bg-sky-400/15 text-sky-300 ring-sky-400/25";
  }

  return "bg-emerald-400/15 text-emerald-300 ring-emerald-400/25";
}

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState({
    field: "name",
    direction: "asc",
  });

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

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchingUsers = users.filter((user) =>
      query
        ? [user.name, user.email, user.address, user.role].some((value) =>
            String(value ?? "").toLowerCase().includes(query),
          )
        : true,
    );

    return matchingUsers.sort((left, right) => {
      const first = String(left[sort.field] ?? "");
      const second = String(right[sort.field] ?? "");
      const comparison = first.localeCompare(second, undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [search, sort, users]);

  function toggleSort(field) {
    setSort((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  return (
    <Card className="mt-8 overflow-hidden border-white/10 bg-[#17181c] text-zinc-100 shadow-2xl shadow-black/20">
      <CardHeader className="gap-5 border-b border-white/10 bg-gradient-to-r from-[#202126] to-[#17181c] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#6842f5]/15 p-2.5 text-[#a78bfa] ring-1 ring-[#6842f5]/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">User directory</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">
                Manage users and administrators
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            aria-label="Search users"
            className="h-10 rounded-xl border-white/10 bg-[#101114] pl-9 text-sm text-white placeholder:text-zinc-600 shadow-inner focus:border-[#6842f5] focus:ring-[#6842f5]"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <p className="border-b border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="p-3 sm:p-5">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101114]/60">
            <Table>
              <TableHeader>
              <TableRow className="border-white/10 bg-white/[0.02] hover:bg-white/[0.02]">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:px-5"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="group flex items-center gap-2 transition-colors hover:text-zinc-200"
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      {sort.field === column.key ? (
                        sort.direction === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 text-[#a78bfa]" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-[#a78bfa]" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-700 transition-colors group-hover:text-zinc-400" />
                      )}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
              </TableHeader>
              <TableBody>
              {isLoading ? (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-28 px-5 text-center text-zinc-500">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-white/10 transition-colors hover:bg-[#6842f5]/[0.08]"
                  >
                    <TableCell className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6842f5] to-[#4779e9] text-xs font-bold text-white shadow-lg shadow-[#6842f5]/20">
                          {getInitials(user.name)}
                        </div>
                        <span className="max-w-40 truncate font-medium text-white sm:max-w-none">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-zinc-300 sm:px-5">
                      {user.email}
                    </TableCell>
                    <TableCell className="max-w-40 truncate px-4 py-4 text-zinc-400 sm:max-w-56 sm:px-5">
                      {user.address}
                    </TableCell>
                    <TableCell className="px-4 py-4 sm:px-5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ${getRoleStyles(user.role)}`}>
                        {user.role}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-28 px-5 text-center text-zinc-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <p className="text-xs text-zinc-500 sm:text-sm">
            Showing <span className="font-medium text-zinc-300">{filteredUsers.length}</span> of{" "}
            <span className="font-medium text-zinc-300">{users.length}</span> users
          </p>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-500">
            {search ? "Filtered results" : "All users"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
