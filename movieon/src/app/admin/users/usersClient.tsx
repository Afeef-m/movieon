"use client"
import React from 'react'
import UserTable from "../components/userTable";

export default function UsersClient() {
  return (
    <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Users Manage</h1>
          <UserTable />
        </div>
  )
}


