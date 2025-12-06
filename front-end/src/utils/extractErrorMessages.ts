export const extractErrorMessages = (err: any): string => {
  if (!err) return "Something went wrong";

  // Axios error
  if (err.response) {
    // If API returns { msg: string } or { message: string }
    if (err.response.data?.msg) return err.response.data.msg;
    if (err.response.data?.message) return err.response.data.message;

    // If API returns errors array
    if (Array.isArray(err.response.data?.errors) && err.response.data.errors.length > 0) {
      return err.response.data.errors.map((e: any) => e.msg || e.message || "").join(", ");
    }

    return "Request failed with status " + err.response.status;
  }

  // Network error
  if (err.request) {
    return "Network error: No response from server";
  }

  // Other JS errors
  if (err.message) return err.message;

  return "An unknown error occurred";
};
