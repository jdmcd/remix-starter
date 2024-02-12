import { User } from "@prisma/client";

import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export default function Header(props: { user: User }) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav user={props.user} />
        </div>
      </div>
    </div>
  );
}
