from mitmproxy import http

JS_INJECTION = '<script type="text/javascript" src="http://localhost/app.js"></script>'

def response(flow: http.HTTPFlow):
    if flow.request.host == "contexto.me" \
        and flow.request.headers.get("sec-fetch-dest", "").lower() == "document" \
        and "text/html" in flow.response.headers.get("content-type", ""):

        content = flow.response.content.decode('utf-8')
        content = content.replace("</html>", JS_INJECTION + "</html>")
        flow.response.content = content.encode('utf-8')

