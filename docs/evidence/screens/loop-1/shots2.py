from playwright.sync_api import sync_playwright
import os
OUT=os.path.expanduser('~/repos/keif-aldiafa-v3/docs/evidence/screens/loop-1')
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in [(360,800),(768,1024),(1024,768),(1440,900)]:
        pg=b.new_page(viewport={'width':w,'height':h})
        pg.goto('http://localhost:3100/',wait_until='networkidle',timeout=60000)
        # scroll through whole page slowly to trigger IntersectionObserver
        total=pg.evaluate("document.body.scrollHeight")
        y=0
        while y<total:
            pg.mouse.wheel(0,600); y+=600
            pg.wait_for_timeout(350)
            total=pg.evaluate("document.body.scrollHeight")
        pg.wait_for_timeout(1500)
        pg.evaluate("window.scrollTo(0,0)")
        pg.wait_for_timeout(800)
        pg.screenshot(path=f'{OUT}/home-{w}-full-scrolled.png',full_page=True)
        # detect invisible sections after scroll
        bad=pg.evaluate("""()=>{
          const out=[];
          document.querySelectorAll('main section,main div[class]').forEach(el=>{
            const r=el.getBoundingClientRect? el.getBoundingClientRect():null;
            const cs=getComputedStyle(el);
            if(el.offsetHeight>150 && (cs.opacity==='0'||cs.visibility==='hidden'))
              out.push({tag:el.tagName,cls:(el.className||'').toString().slice(0,60),h:el.offsetHeight});
          });
          return out.slice(0,10);}""")
        print(w,'hidden-after-scroll:',bad)
        pg.close()
    b.close()
