import { ApiResponse } from "../utils/api-response.js";

const healthCheck = (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, "Server is running!", null));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", null));
  }
};

export { healthCheck };
