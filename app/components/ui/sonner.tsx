import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ theme, ...props }: ToasterProps) => {
  return <Sonner theme={theme} className="toaster group" {...props} />;
};

export { Toaster };
