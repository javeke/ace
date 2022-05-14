import { StatusCodes } from "http-status-codes";
import { ErrorDataResponse } from "../common/types";

const errorHandler = (response: Response): ErrorDataResponse => {

  if(response.status === StatusCodes.FORBIDDEN) {
    return ({ 
      data: null,
      code: StatusCodes.FORBIDDEN,
      msg: "Session Expired"
    });
  }

  if(response.status === StatusCodes.UNAUTHORIZED) {
    return ({ 
      data: null,
      code: StatusCodes.UNAUTHORIZED,
      msg: "Unauthorized Access"
    });
  }

  if(response.status === StatusCodes.BAD_REQUEST) {
    return ({ 
      data: null,
      code: StatusCodes.BAD_REQUEST,
      msg: "Bad Request"
    });
  }

  if(response.status === StatusCodes.BAD_GATEWAY) {
    return ({ 
      data: null,
      code: StatusCodes.BAD_GATEWAY,
      msg: "Bad Gateway"
    });
  }

  if(response.status === StatusCodes.NOT_MODIFIED) {
    return ({ 
      data: null,
      code: StatusCodes.NOT_MODIFIED,
      msg: "Request Not Performed"
    });
  }

  return ({ 
    data: null,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: "Interal Server Error",
    error: "An Error Occurred"
  });
}

const serverErrorResponse = { 
  data: null,
  code: StatusCodes.CONFLICT,
  msg: "Server Error",
  error: "Request Not Sent"
}

export {
  serverErrorResponse
};

export default errorHandler;