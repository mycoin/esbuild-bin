import { Action } from "./interfaces";

export default (
  action: Action,
  args: Record<string, string | number | boolean>,
) => {
  const params = {};
  return {
    action,
    args,
  };
};
