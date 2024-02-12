import { useUser } from "~/utils/utils";

export default function Dashboard() {
  useUser();
  return <p>Logged in!</p>;
}
