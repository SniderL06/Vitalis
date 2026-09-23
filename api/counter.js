module.exports = async function handler(req, res) {
    // Encabezados CORS y control de caché
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const action = (req.query && req.query.action === 'get') ? 'get' : 'hit';
    const KEY = 'vitalis_coach_official_visits';
    const UPSTREAM_URL = `https://countapi.mileshilliard.com/api/v1/${action}/${KEY}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(UPSTREAM_URL, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Vitalis-Coach/1.0'
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Upstream status ${response.status}`);
        }

        const data = await response.json();
        if (data && typeof data.value === 'number') {
            return res.status(200).json({
                count: data.value,
                ok: true
            });
        }
        throw new Error('Invalid count payload');
    } catch (err) {
        console.error('Counter API error:', err);
        // Fallback dinámico razonable si el servicio externo estuviera caído temporalmente
        return res.status(200).json({
            count: 32,
            ok: false,
            fallback: true,
            error: err.message
        });
    }
};
