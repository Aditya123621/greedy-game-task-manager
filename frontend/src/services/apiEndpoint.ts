const apiEndPoints = {
  SIGN_IN: "/auth/signin",
  SIGN_UP: "/auth/register",
  LOG_OUT: "/auth/logout",
  GET_USER_INFO: "/auth/user-info",
  UPDATE_PROFILE: "/user/profile",
  UPLOAD_PROFILE_IMAGE: "/user/upload",
  ADD_TODO: "/api/todos/add-todo",
  GET_ALL_TODO: "/api/todos",
  GET_TODO_BY_ID: (id: string) => `/api/todos/${id}`,
};

export default apiEndPoints;
