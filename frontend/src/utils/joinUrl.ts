export const joinUrl = (base: string, path: string) => {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};
