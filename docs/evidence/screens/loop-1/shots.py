from playwright.sync_api import sync_playwright
import os
OUT=os.path.expanduser('~/repos/keif-aldiafa-v3/docs/evidence/screens/loop-1')
widths=[(360,800),(768,1024),(1024,768),(1440,900)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in widths:
        pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1,
                      user_agent='Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' if w<=768 else None)
        pg.goto('http://localhost:3100/',wait_until='networkidle',timeout=60000)
        pg.wait_for_timeout(2500)
        # above-the-fold shot
        pg.screenshot(path=f'{OUT}/home-{w}-fold.png')
        # full page
        pg.screenshot(path=f'{OUT}/home-{w}-full.png',full_page=True)
        # metrics
        m=pg.evaluate("""()=>({h:document.body.scrollHeight,
            dir:document.documentElement.dir||getComputedStyle(document.body).direction,
            overflowX:document.body.scrollWidth>window.innerWidth?document.body.scrollWidth:0,
            imgs:document.images.length,
            sections:document.querySelectorAll('main section, main > div > section').length})""")
        print(w,m)
        pg.close()
    b.close()
