import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = 'ownerapi';
const REDIRECT_URI = 'https://auth.tesla.com/void/callback';
const TOKEN_URL = 'https://auth.tesla.com/oauth2/v3/token';

/**
 * POST /api/tesla-proxy
 * Proxy para peticiones a las APIs de Tesla
 * Maneja: exchange de tokens, refresh, y peticiones a Owner/Akamai APIs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle CORS preflight
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    // --- Intercambio de código por tokens ---
    if ('grant_type' in body) {
      let requestBody: URLSearchParams;

      if (body.grant_type === 'authorization_code') {
        if (!body.code || !body.code_verifier) {
          return NextResponse.json(
            { error: 'Falta code o code_verifier' },
            { status: 400, headers: corsHeaders }
          );
        }
        requestBody = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          code: body.code,
          redirect_uri: REDIRECT_URI,
          code_verifier: body.code_verifier,
        });
      } else if (body.grant_type === 'refresh_token') {
        if (!body.refresh_token) {
          return NextResponse.json(
            { error: 'Falta refresh_token' },
            { status: 400, headers: corsHeaders }
          );
        }
        requestBody = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
          refresh_token: body.refresh_token,
        });
      } else {
        return NextResponse.json(
          { error: 'grant_type inválido' },
          { status: 400, headers: corsHeaders }
        );
      }

      const teslaResponse = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody.toString(),
      });

      const data = await teslaResponse.json();
      return NextResponse.json(data, { 
        status: teslaResponse.status,
        headers: corsHeaders 
      });
    }

    // --- Peticiones proxy a APIs de Tesla ---
    if (body.action === 'proxy') {
      if (!body.targetUrl || !body.accessToken) {
        return NextResponse.json(
          { error: 'Falta targetUrl o accessToken' },
          { status: 400, headers: corsHeaders }
        );
      }

      const apiResponse = await fetch(body.targetUrl, {
        headers: {
          'Authorization': `Bearer ${body.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (apiResponse.status === 204) {
        return new NextResponse(null, { 
          status: 204,
          headers: corsHeaders 
        });
      }

      const data = await apiResponse.json();
      return NextResponse.json(data, { 
        status: apiResponse.status,
        headers: corsHeaders 
      });
    }

    return NextResponse.json(
      { error: 'Petición inválida' },
      { status: 400, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error en proxy:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/tesla-proxy
 * Maneja CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
