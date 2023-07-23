import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Form, Outlet } from "@remix-run/react";






export default function Index() {
  return (
    <Form>
      <Outlet />
    </Form>
  )
}
