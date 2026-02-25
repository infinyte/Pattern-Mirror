#!/usr/bin/env python3
"""Build script for The Pattern Mirror GitHub Pages blog."""

import re
import os
import math
import html as html_mod

BASE = os.path.dirname(os.path.abspath(__file__))

# ── Episode metadata ────────────────────────────────────────────────────────

EPISODES = [
    {
        "num": 1,
        "file": "Episode1/pattern-mirror-episode1.md",
        "out": "ep1.html",
        "color": "#1e6b8a",
        "short": "The Middlemen",
    },
    {
        "num": 2,
        "file": "Episode2/pattern-mirror-episode2.md",
        "out": "ep2.html",
        "color": "#6b3fa0",
        "short": "The Workflows",
    },
    {
        "num": 3,
        "file": "Episode3/pattern-mirror-episode3.md",
        "out": "ep3.html",
        "color": "#c27013",
        "short": "Resilience & Performance",
    },
    {
        "num": 4,
        "file": "Episode4/pattern-mirror-episode4.md",
        "out": "ep4.html",
        "color": "#a63d6a",
        "short": "The Deep End",
    },
]

# ── Helpers ──────────────────────────────────────────────────────────────────

def read_file(path):
    with open(os.path.join(BASE, path), "r", encoding="utf-8") as f:
        return f.read()

def write_file(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full) or ".", exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

def slugify(text):
    """Convert heading text to URL slug."""
    text = re.sub(r'[^\w\s-]', '', text.lower())
    text = re.sub(r'[\s]+', '-', text).strip('-')
    return text

def word_count(text):
    return len(re.findall(r'\S+', text))

def reading_time(text):
    return max(1, math.ceil(word_count(text) / 238))

def escape(text):
    return html_mod.escape(text)

# ── Markdown to HTML converter ──────────────────────────────────────────────

class MarkdownConverter:
    def __init__(self):
        self.headings = []  # (level, slug, text)
        self.slug_counts = {}
        self.title = ""
        self.first_para = ""

    def unique_slug(self, text):
        base = slugify(text)
        if not base:
            base = "section"
        if base in self.slug_counts:
            self.slug_counts[base] += 1
            return f"{base}-{self.slug_counts[base]}"
        else:
            self.slug_counts[base] = 1
            return base

    def convert(self, md_text, ep_num=None):
        lines = md_text.split('\n')
        out = []
        i = 0
        in_code_block = False
        code_lang = ""
        code_lines = []
        in_list = False
        list_type = None  # 'ul' or 'ol'
        in_blockquote = False
        bq_lines = []
        first_h1_found = False
        para_lines = []

        def flush_para():
            nonlocal para_lines
            if para_lines:
                text = ' '.join(para_lines)
                text = self.inline(text, ep_num)
                out.append(f'<p>{text}</p>')
                if not self.first_para:
                    raw = re.sub(r'<[^>]+>', '', text)
                    self.first_para = raw[:160]
                para_lines = []

        def flush_list():
            nonlocal in_list, list_type
            if in_list:
                tag = list_type
                out.append(f'</{tag}>')
                in_list = False
                list_type = None

        def flush_bq():
            nonlocal in_blockquote, bq_lines
            if in_blockquote:
                bq_content = '\n'.join(bq_lines)
                # Check for callout type
                callout_match = re.match(r'^\s*\[!(NOTE|WARNING|TIP|INFO|MATH)\]', bq_content)
                if callout_match:
                    ctype = callout_match.group(1).lower()
                    bq_content = bq_content[callout_match.end():].strip()
                    css_class = f'callout callout-{ctype}'
                    if ctype == 'math':
                        inner = self.convert_inner(bq_content, ep_num)
                        out.append(f'<div class="{css_class}"><div class="callout-label">&#8721; MATH</div>{inner}</div>')
                    else:
                        inner = self.convert_inner(bq_content, ep_num)
                        out.append(f'<div class="{css_class}">{inner}</div>')
                else:
                    inner = self.convert_inner(bq_content, ep_num)
                    out.append(f'<blockquote>{inner}</blockquote>')
                bq_lines = []
                in_blockquote = False

        while i < len(lines):
            line = lines[i]

            # Code blocks
            if line.strip().startswith('```'):
                if in_code_block:
                    code = '\n'.join(code_lines)
                    code = escape(code)
                    lang_class = f' class="language-{code_lang}"' if code_lang else ''
                    out.append(f'<pre><code{lang_class}>{code}</code></pre>')
                    in_code_block = False
                    code_lines = []
                    code_lang = ""
                else:
                    flush_para()
                    flush_list()
                    flush_bq()
                    in_code_block = True
                    code_lang = line.strip()[3:].strip()
                i += 1
                continue

            if in_code_block:
                code_lines.append(line)
                i += 1
                continue

            # Blockquotes
            if line.startswith('>'):
                flush_para()
                flush_list()
                bq_line = line[1:].lstrip() if len(line) > 1 else ''
                if line == '>':
                    bq_line = ''
                bq_lines.append(bq_line)
                in_blockquote = True
                i += 1
                continue
            elif in_blockquote:
                flush_bq()

            stripped = line.strip()

            # Blank line
            if not stripped:
                flush_para()
                flush_list()
                i += 1
                continue

            # Headings
            heading_match = re.match(r'^(#{1,3})\s+(.*)', line)
            if heading_match:
                flush_para()
                flush_list()
                level = len(heading_match.group(1))
                text = heading_match.group(2).strip()

                if level == 1 and not first_h1_found:
                    first_h1_found = True
                    self.title = text
                    slug = self.unique_slug(text)
                    out.append(f'<h1 id="{slug}">{self.inline(text, ep_num)}</h1>')
                else:
                    slug = self.unique_slug(text)
                    if level <= 3:
                        self.headings.append((level, slug, text))
                    out.append(f'<h{level} id="{slug}">{self.inline(text, ep_num)}</h{level}>')
                i += 1
                continue

            # Horizontal rule
            if re.match(r'^---+\s*$', stripped) or re.match(r'^\*\*\*+\s*$', stripped):
                flush_para()
                flush_list()
                out.append('<hr>')
                i += 1
                continue

            # Table
            if '|' in stripped and i + 1 < len(lines) and re.match(r'^[\s|:-]+$', lines[i+1].strip()):
                flush_para()
                flush_list()
                # Parse table
                table_lines = []
                while i < len(lines) and '|' in lines[i].strip():
                    table_lines.append(lines[i].strip())
                    i += 1
                out.append(self.parse_table(table_lines, ep_num))
                continue

            # Unordered list
            list_match = re.match(r'^(\s*)[-*]\s+(.*)', line)
            if list_match:
                flush_para()
                content = list_match.group(2)
                if not in_list or list_type != 'ul':
                    flush_list()
                    out.append('<ul>')
                    in_list = True
                    list_type = 'ul'
                out.append(f'<li>{self.inline(content, ep_num)}</li>')
                i += 1
                continue

            # Ordered list
            ol_match = re.match(r'^(\s*)\d+\.\s+(.*)', line)
            if ol_match:
                flush_para()
                content = ol_match.group(2)
                if not in_list or list_type != 'ol':
                    flush_list()
                    out.append('<ol>')
                    in_list = True
                    list_type = 'ol'
                out.append(f'<li>{self.inline(content, ep_num)}</li>')
                i += 1
                continue

            # Close list if we're in one and this isn't a list item
            if in_list:
                flush_list()

            # Regular paragraph text
            para_lines.append(stripped)
            i += 1

        # Flush remaining
        flush_para()
        flush_list()
        flush_bq()

        return '\n'.join(out)

    def convert_inner(self, text, ep_num=None):
        """Convert a smaller block of markdown (inside blockquotes etc)."""
        sub = MarkdownConverter()
        return sub.convert(text, ep_num)

    def parse_table(self, lines, ep_num=None):
        """Parse markdown table lines into HTML."""
        if len(lines) < 2:
            return ''
        # Header row
        headers = [c.strip() for c in lines[0].strip('|').split('|')]
        # Skip separator row (line 1)
        rows = []
        for line in lines[2:]:
            cells = [c.strip() for c in line.strip('|').split('|')]
            rows.append(cells)

        html_parts = ['<table>', '<thead><tr>']
        for h in headers:
            html_parts.append(f'<th>{self.inline(h, ep_num)}</th>')
        html_parts.append('</tr></thead><tbody>')
        for row in rows:
            html_parts.append('<tr>')
            for cell in row:
                html_parts.append(f'<td>{self.inline(cell, ep_num)}</td>')
            html_parts.append('</tr>')
        html_parts.append('</tbody></table>')
        return '\n'.join(html_parts)

    def inline(self, text, ep_num=None):
        """Process inline markdown elements."""
        # Cross-episode links
        text = re.sub(r'\[Episode\s*1\]\([^)]*\)', '<a href="ep1.html">Episode 1</a>', text)
        text = re.sub(r'\[Episode\s*2\]\([^)]*\)', '<a href="ep2.html">Episode 2</a>', text)
        text = re.sub(r'\[Episode\s*3\]\([^)]*\)', '<a href="ep3.html">Episode 3</a>', text)
        text = re.sub(r'\[Episode\s*4\]\([^)]*\)', '<a href="ep4.html">Episode 4</a>', text)
        text = re.sub(r'\[link-to-episode-(\d)\]', r'<a href="ep\1.html">Episode \1</a>', text)

        # Links [text](url)
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)

        # Bold + italic ***text*** or ___text___
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', text)
        # Bold **text**
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        # Italic *text*
        text = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<em>\1</em>', text)

        # Inline code `text`
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)

        return text


# ── HTML templates ──────────────────────────────────────────────────────────

HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{description}">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="{og_type}">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Code+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
<link rel="stylesheet" href="assets/style.css">
</head>
"""

NAVBAR_TEMPLATE = """<nav class="navbar">
<a href="index.html" class="navbar-logo">The Pattern Mirror</a>
<input type="checkbox" id="nav-toggle" class="navbar-toggle" hidden>
<label for="nav-toggle" class="navbar-hamburger" aria-label="Toggle navigation">
<span></span><span></span><span></span>
</label>
<div class="navbar-links">
<a href="ep1.html"{ep1_active}>Ep 1</a>
<a href="ep2.html"{ep2_active}>Ep 2</a>
<a href="ep3.html"{ep3_active}>Ep 3</a>
<a href="ep4.html"{ep4_active}>Ep 4</a>
<a href="carousel.html">Carousel</a>
</div>
</nav>
"""

FOOTER_TEMPLATE = """<footer>
<div class="footer-title">The Pattern Mirror</div>
<div class="footer-tagline">Every Enterprise Pattern Has a Code-Level Twin</div>
<div class="footer-links">
<div class="footer-col">
<h4>Episodes</h4>
<a href="ep1.html">Ep 1: The Middlemen</a>
<a href="ep2.html">Ep 2: The Workflows</a>
<a href="ep3.html">Ep 3: Resilience &amp; Performance</a>
<a href="ep4.html">Ep 4: The Deep End</a>
</div>
<div class="footer-col">
<h4>More</h4>
<a href="carousel.html">Pattern Carousel</a>
<a href="index.html">Series Home</a>
</div>
</div>
<p class="footer-attribution">Built with Claude</p>
</footer>
"""

PRISM_SCRIPTS = """<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js" defer></script>
"""

def navbar(active_ep=None):
    attrs = {f"ep{i}_active": "" for i in range(1,5)}
    if active_ep:
        attrs[f"ep{active_ep}_active"] = ' class="active"'
    return NAVBAR_TEMPLATE.format(**attrs)

def build_toc_html(headings):
    """Build TOC sidebar from list of (level, slug, text) tuples."""
    if not headings:
        return ''
    parts = ['<nav class="toc" aria-label="Table of contents">',
             '<div class="toc-label">Contents</div>', '<ul>']
    for level, slug, text in headings:
        css = 'toc-h2' if level == 2 else 'toc-h3'
        parts.append(f'<li class="{css}"><a href="#{slug}">{escape(text)}</a></li>')
    parts.append('</ul></nav>')
    return '\n'.join(parts)

TOC_SCRIPT = """<script>
(function(){
  var toc = document.querySelector('.toc');
  if (!toc) return;
  var links = toc.querySelectorAll('a');
  var headings = [];
  links.forEach(function(a){
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) headings.push({el:el, a:a});
  });
  if (!headings.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){
        links.forEach(function(a){a.classList.remove('active');});
        headings.forEach(function(h){
          if(h.el===e.target) h.a.classList.add('active');
        });
      }
    });
  }, {rootMargin: '-80px 0px -70% 0px'});
  headings.forEach(function(h){obs.observe(h.el);});
})();
</script>
"""

PROGRESS_SCRIPT = """<script>
(function(){
  var bar = document.querySelector('.progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', function(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  });
})();
</script>
"""


# ── Build episode pages ─────────────────────────────────────────────────────

def build_episode(ep):
    md = read_file(ep["file"])
    conv = MarkdownConverter()
    body_html = conv.convert(md, ep["num"])
    title = conv.title or f"Episode {ep['num']}"
    desc = conv.first_para[:160] if conv.first_para else title
    rt = reading_time(md)

    toc_html = build_toc_html(conv.headings)

    # Prev/next nav
    prev_link = ""
    next_link = ""
    if ep["num"] > 1:
        pe = EPISODES[ep["num"]-2]
        prev_link = f'<a href="{pe["out"]}">&#8592; Ep {pe["num"]}: {pe["short"]}</a>'
    if ep["num"] < 4:
        ne = EPISODES[ep["num"]]
        next_link = f'<a href="{ne["out"]}">Ep {ne["num"]}: {ne["short"]} &#8594;</a>'

    page = HEAD_TEMPLATE.format(
        title=f"{title} — The Pattern Mirror",
        description=escape(desc),
        og_title=escape(title),
        og_type="article",
    )
    page += "<body>\n"
    page += navbar(ep["num"])
    page += '<div class="progress-bar"></div>\n'
    page += '<div class="article-wrapper">\n'
    page += '<article class="article-content">\n'

    # Metadata strip
    page += '<div class="article-meta">\n'
    page += f'<span class="ep-badge" style="border-left:3px solid {ep["color"]}">Episode {ep["num"]}</span>\n'
    page += '<span class="sep">&middot;</span>\n'
    page += f'<span class="read-time-badge">{rt} min read</span>\n'
    page += '<span class="sep">&middot;</span>\n'
    page += '<span>Kurt Mitchell</span>\n'
    page += '</div>\n'

    page += body_html
    page += '\n</article>\n'
    page += toc_html
    page += '\n</div>\n'

    # Episode nav
    page += '<div class="episode-nav">\n'
    if prev_link:
        page += prev_link
    else:
        page += '<span></span>'
    page += '<span class="spacer"></span>'
    if next_link:
        page += next_link
    else:
        page += '<span></span>'
    page += '\n</div>\n'

    page += FOOTER_TEMPLATE
    page += PRISM_SCRIPTS
    page += TOC_SCRIPT
    page += PROGRESS_SCRIPT
    page += "</body>\n</html>"

    write_file(f"docs/{ep['out']}", page)
    print(f"  {ep['out']:20s}  {len(page):>8,} bytes  ({rt} min read, {len(conv.headings)} TOC entries)")
    return {
        "title": title,
        "short": ep["short"],
        "desc": desc,
        "rt": rt,
        "num": ep["num"],
        "color": ep["color"],
        "out": ep["out"],
        "excerpt": conv.first_para[:150] if conv.first_para else "",
    }


# ── Build index page ────────────────────────────────────────────────────────

def build_index(ep_data):
    page = HEAD_TEMPLATE.format(
        title="The Pattern Mirror — Software Architecture Series",
        description="A 4-part series mapping enterprise infrastructure patterns to application-level equivalents, traced to pure mathematics.",
        og_title="The Pattern Mirror",
        og_type="website",
    )
    page += "<body>\n"
    page += navbar()

    # Hero
    page += """<section class="hero">
<div class="hero-glow-blue"></div>
<div class="hero-glow-green"></div>
<div class="hero-inner">
<div class="hero-bars">
<span style="background:#3b82f6"></span>
<span style="background:#10b981"></span>
<span style="background:#f59e0b"></span>
</div>
<h1>The Pattern Mirror</h1>
<p class="hero-subtitle">Every Enterprise Pattern Has a Code-Level Twin</p>
<p class="hero-tagline">Platform &rarr; Application &rarr; Pure Mathematics</p>
<p class="hero-author">Kurt Mitchell &mdash; Senior Software Engineer / Architect &middot; 20 Years Enterprise Experience</p>
</div>
</section>
"""

    # Episode cards
    page += '<section class="episodes">\n'
    page += '<h2>The Series</h2>\n'
    page += '<div class="episode-grid">\n'

    for ep in ep_data:
        page += f"""<div class="episode-card">
<div class="episode-card-border" style="background:{ep['color']}"></div>
<div class="episode-card-body">
<div class="episode-card-number" style="color:{ep['color']}">0{ep['num']}</div>
<h3 class="episode-card-title">{escape(ep['short'])}</h3>
<p class="episode-card-excerpt">{escape(ep['excerpt'])}</p>
<div class="episode-card-meta">
<span class="read-time-badge">{ep['rt']} min read</span>
</div>
<a href="{ep['out']}" class="episode-card-link" style="color:{ep['color']}">Read Episode &rarr;</a>
</div>
</div>
"""
    page += '</div>\n</section>\n'

    # Carousel preview
    page += """<section class="carousel-preview">
<h2>Interactive Pattern Carousel</h2>
<iframe src="carousel.html" width="560" height="560" loading="lazy" title="Pattern Mirror Carousel"></iframe>
<a href="carousel.html" class="carousel-link-mobile">View Interactive Carousel &rarr;</a>
<br><a href="carousel.html" class="carousel-link">View full size &rarr;</a>
</section>
"""

    # About
    page += """<section class="about">
<h2>About the Series</h2>
<p>The same architectural solutions appear at every level of the stack because the same structural problems appear at every level. Architecture is fractal. This four-part series maps 12 enterprise infrastructure patterns to their application-level equivalents &mdash; and traces each pair back to the pure mathematics that makes them work.</p>
<p><strong>Kurt Mitchell</strong> &mdash; Enterprise Architect &amp; Senior Software Engineer | Designing distributed systems across DoD, hospitality, healthcare, aviation, and cloud platforms for 20 years.</p>
</section>
"""

    page += FOOTER_TEMPLATE
    page += "</body>\n</html>"
    write_file("docs/index.html", page)
    print(f"  {'index.html':20s}  {len(page):>8,} bytes")


# ── Build carousel page ─────────────────────────────────────────────────────

def build_carousel_page():
    page = HEAD_TEMPLATE.format(
        title="Pattern Carousel — The Pattern Mirror",
        description="Interactive carousel showing 12 enterprise-to-application pattern pairs with animated SVG diagrams.",
        og_title="Pattern Mirror Carousel",
        og_type="website",
    )
    page += "<body>\n"
    page += navbar()
    page += '<main class="carousel-page">\n'
    page += '<div id="carousel-root"></div>\n'
    page += '</main>\n'
    page += FOOTER_TEMPLATE
    page += '<script type="module" src="assets/carousel.js"></script>\n'
    page += "</body>\n</html>"
    write_file("docs/carousel.html", page)
    print(f"  {'carousel.html':20s}  {len(page):>8,} bytes")


# ── Validation ──────────────────────────────────────────────────────────────

def validate():
    issues = []
    files_report = []

    html_files = ["docs/index.html", "docs/carousel.html", "docs/ep1.html", "docs/ep2.html", "docs/ep3.html", "docs/ep4.html"]
    other_files = ["docs/assets/style.css", "docs/assets/carousel.js", "docs/.nojekyll"]

    # Check all files exist and report sizes
    for f in html_files + other_files:
        full = os.path.join(BASE, f)
        if os.path.exists(full):
            size = os.path.getsize(full)
            files_report.append((f, size))
        else:
            issues.append(f"MISSING: {f}")
            files_report.append((f, 0))

    # Check links in HTML files
    for f in html_files:
        full = os.path.join(BASE, f)
        if not os.path.exists(full):
            continue
        content = read_file(f)
        # Find relative hrefs
        for m in re.finditer(r'href="([^"#][^"]*)"', content):
            href = m.group(1)
            if href.startswith('http') or href.startswith('//') or href.startswith('mailto:'):
                continue
            target = os.path.join(BASE, "docs", href)
            if not os.path.exists(target):
                issues.append(f"BROKEN LINK in {f}: {href}")

    # CSS brace balance
    css = read_file("docs/assets/style.css")
    opens = css.count('{')
    closes = css.count('}')
    if opens != closes:
        issues.append(f"CSS brace imbalance: {opens} open, {closes} close")

    # Print report
    print("\n  File Size Report:")
    print(f"  {'File':<25s} {'Size':>10s}")
    print(f"  {'-'*25} {'-'*10}")
    total = 0
    for f, size in files_report:
        total += size
        print(f"  {f:<25s} {size:>10,}")
    print(f"  {'TOTAL':<25s} {total:>10,}")

    return issues, len(files_report), total


# ── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Building The Pattern Mirror blog...\n")

    # Create .nojekyll
    write_file("docs/.nojekyll", "")

    # Build episodes
    print("Episodes:")
    ep_data = []
    for ep in EPISODES:
        data = build_episode(ep)
        ep_data.append(data)

    # Build index
    print("\nPages:")
    build_index(ep_data)
    build_carousel_page()

    # Validation
    print("\nValidation:")
    issues, file_count, total_size = validate()

    if issues:
        print(f"\n  Issues found: {len(issues)}")
        for issue in issues:
            print(f"    - {issue}")
    else:
        print("\n  No issues found.")

    print(f"""
=== BUILD COMPLETE ===
Files generated: {file_count}
Total size: {total_size:,} bytes

Open in browser:
  index.html          - Series home
  ep1.html            - Episode 1: The Middlemen
  ep2.html            - Episode 2: The Workflows
  ep3.html            - Episode 3: Resilience & Performance
  ep4.html            - Episode 4: The Deep End
  carousel.html       - Interactive Pattern Carousel

To deploy to GitHub Pages:
  1. Push all files to your repository
  2. Go to Settings > Pages > Source: Deploy from branch > main > /docs
  3. Your site will be live at https://[username].github.io/Pattern-Mirror/

Broken links: {'none' if not [i for i in issues if 'BROKEN' in i] else ', '.join(i for i in issues if 'BROKEN' in i)}
Validation issues: {'none' if not issues else str(len(issues)) + ' found'}
""")
