"Notes:
"   --normal text is black, so easy to see.
"   --light, but dark enough not to burn your eyes.
"   --light so you don't see your reflection on reflective monitors.
"   --the background should not look gray. It should look milky and warm.
"     Colors are tailored for my quirky monitor so you may need to adjust.
"     Try #D4D3A4 for the background if it looks too gray.
"   --for gvim only. 
"   --looks best with thick, boldy fonts.

set background=light
hi clear
if exists("syntax_on")
  syntax reset
endif
let g:colors_name = "milk"

"hi <option>: gui guifg guibg term cterm ctermfg ctermbg
"guifg, guibg, ctermfg, ctermbg: fg bg colorName[n] #ffffff none 0-255
"gui, cterm, term: none reverse underline bold undercurl standout inverse itallic


hi Normal		guifg=black			guibg=#D4D3A4 "#D5D1B3 "#D4D3A4

hi NonText		guifg=#4C4C3D		guibg=bg
hi comment		guifg=#336600	guibg=bg
hi constant		guifg=#6B2121		guibg=bg
	hi String	guifg=darkred		guibg=bg
	hi Character guifg=#E6005C	guibg=bg
	"hi Number	guifg=darkRed		guibg=bg
	hi Boolean	guifg=#3E3EB2		guibg=bg
	hi Float	guifg=#523D66	guibg=bg
	
hi identifier	guifg=#B26B00	guibg=bg
	"this seems to work on vim script functions, not C functions
	"hi function	guifg=black		guibg=darkGray 
	
hi statement	guifg=#5C3D1F	guibg=bg	
	"hi Conditional	guifg=darkBlue	guibg=bg
	"hi Repeat	guifg=darkBlue	guibg=bg
	hi Label	gui=none	guifg=fg	guibg=#FFB84D
	hi Operator	guifg=black	guibg=#FFCCE6
	"hi Keyword	guifg=darkBlue	guibg=bg
	"hi Exception guifg=darkBlue	guibg=bg

hi preproc		guifg=#CC297A	guibg=bg
"hi preproc		guifg=#B85D5D	guibg=bg
"hi preproc		guifg=#993399	guibg=bg
	"hi Include	guifg=darkMagenta	guibg=bg
	"hi Define	guifg=darkMagenta	guibg=bg
	"hi Macro	guifg=darkMagenta	guibg=bg
	"hi PreCondit guifg=darkMagenta	guibg=bg
	
hi type			guifg=#00476B		guibg=bg
	"hi StorageClass guifg=blue		guibg=bg
	"hi Structure	guifg=blue		guibg=bg
	"hi Typedef		guifg=blue		guibg=bg

hi special		guifg=#007A7A		guibg=bg
	"hi SpecialChar	guifg=blue		guibg=bg
	"hi Tag			guifg=blue		guibg=bg
	"hi Delimiter	guifg=blue		guibg=bg
	"hi SpecialComment	guifg=blue		guibg=bg
	"hi Debug		guifg=blue		guibg=bg


hi Underlined	gui=underline guifg=blue	guibg=bg term=underline cterm=underline ctermfg=5

"hi SpecialKey	guifg=green		guibg=yellow

"hi Ignore		guifg=fg		guibg=bg
"hi Conceal		guifg=black	guibg=yellow

hi ErrorMsg		guifg=black		guibg=#FF6666
hi WarningMsg	guifg=black	guibg=#FFFF66
hi ModeMsg		guifg=black	guibg=#C0BCA1
hi MoreMsg		guifg=black	guibg=#8DEECD
hi Error		guifg=black	guibg=#FF6666 
hi Question		guifg=black	guibg=#8DEECD
hi Directory	guifg=blue	guibg=bg
hi WildMenu		guifg=black	guibg=yellow

hi Todo			guifg=black	guibg=darkYellow
hi Search		guifg=black	guibg=pink   "#FFFF66
hi IncSearch	guifg=fg		guibg=bg
hi LineNr		guifg=darkgray	guibg=#C0BCA1
hi title		gui=bold

hi TabLineSel	guifg=gray	guibg=black
hi TabLine		guifg=black	guibg=darkGray
hi TabLineFill	guifg=fg	guibg=bg

hi StatusLineNC	guibg=gray	guifg=black
hi StatusLine	guibg=#8DEECD	guifg=black
hi VertSplit	guibg=darkGray	guifg=black

hi visual		guibg=#FFA366
hi VisualNOS	guibg=#FFA366

hi DiffChange	guifg=black	guibg=yellow "darkyellow "#FFFF66
hi DiffText		guifg=black	guibg=#FF6666
hi DiffAdd		guifg=black	guibg=#8DEECD
hi DiffDelete   guifg=black	guibg=white

hi Folded		guifg=black	guibg=#B8B8A0
hi FoldColumn	guifg=black	guibg=gray
"hi cIf0		guifg=gray

hi SignColumn	guifg=darkgray	guibg=#C0BCA1

hi SpellBad		gui=undercurl	guifg=black	guibg=#FF6666
hi SpellCap		guifg=black	guibg=darkYellow
hi SpellRare	guifg=black	guibg=darkYellow
hi SpellLocal	guifg=black	guibg=darkYellow


hi Pmenu		guifg=black	guibg=darkYellow
hi PmenuSel		guifg=black	guibg=#FF6666
hi PmenuSbar	guifg=fg	guibg=darkYellow
hi PmenuThumb	guifg=fg	guibg=black

hi Cursor		guifg=bg guibg=black
hi CursorLine	guibg=#C0BCA1
hi CursorColumn	guibg=#C0BCA1
hi CursorIM		guifg=pink	guibg=black

hi MatchParen	guifg=black	guibg=cyan

"highlights columns. Like first few columns in a cobol file.
hi ColorColumn		guibg=#B8B8A0
