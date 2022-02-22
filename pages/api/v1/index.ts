import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {
  data: string;
  msg: string;
  code : number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  res.status(200).json({ data: "Welcome to Ace API",  msg: 'successful', code: 200 });
}
