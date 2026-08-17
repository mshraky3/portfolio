#!/usr/bin/env python3
# Renders a plain-text cover letter (subject line + body, blank-line separated
# paragraphs) into a clean one-page PDF matching the resume's visual style.
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

if len(sys.argv) < 3:
    print("usage: gen_cover_letter.py <input.txt> <output.pdf>")
    sys.exit(1)

IN, OUT = sys.argv[1], sys.argv[2]
INK = HexColor("#111111")
GREY = HexColor("#333333")

subject_style = ParagraphStyle("subject", fontName="Helvetica-Bold", fontSize=12,
                                leading=15, textColor=INK, alignment=TA_CENTER, spaceAfter=10)
body_style = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=15,
                             textColor=GREY, alignment=TA_LEFT, spaceAfter=9)

with open(IN, "r", encoding="utf-8") as f:
    raw = f.read().strip()

lines = raw.split("\n")
subject = None
if lines and lines[0].lower().startswith("subject:"):
    subject = lines[0].split(":", 1)[1].strip()
    raw = "\n".join(lines[1:]).strip()

paras = [p.strip() for p in raw.split("\n\n") if p.strip()]

story = []
if subject:
    story.append(Paragraph(subject, subject_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=HexColor("#999999"),
                             spaceBefore=1, spaceAfter=10))

for p in paras:
    # preserve intentional line breaks (signature block, bullet lines) as <br/>
    html = p.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
    story.append(Paragraph(html, body_style))

doc = SimpleDocTemplate(OUT, pagesize=A4,
                         leftMargin=22 * mm, rightMargin=22 * mm,
                         topMargin=20 * mm, bottomMargin=18 * mm,
                         title="Mahmoud Alshraky - Cover Letter")
doc.build(story)
print("wrote", OUT)
