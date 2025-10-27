// app/api/token/route.ts

import { auth0 } from "@/lib/auth0";

export async function GET() {
    const accessToken = await auth0.getAccessToken({
        audience: process.env.AUTH0_AUDIENCE
    });

    console.log(accessToken)

    if (!accessToken) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return Response.json({ token: accessToken.token });
}
