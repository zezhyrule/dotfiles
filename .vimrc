                " " " " " " " " " " " " " "
                " Author: zezhyrule       "
                " Last Edited: 2016-03-13 "
     " ~ ~ ~    " " " " " " " " " " " " " "    ~ ~ ~ "

" Use Vim settings, rather than Vi settings (much better!).
set nocompatible

"                  ====================
"                ~ = General Settings = ~
"                  ====================

set backspace=indent,eol,start " allow backspacing over everything in insert mode
if has("vms")
    set nobackup               " do not keep a backup file, use versions instead
else
    set backup                 " keep a backup file
endif
set backupdir=~/.vim/backup    " send backup files to .vim/backup
set noswapfile                 " disable saving swap files
set history=50                 " keep 50 lines of command line history
set ruler                      " show the cursor position all the time
set showcmd                    " display incomplete commands
set incsearch                  " do incremental searching
set ignorecase                 " ignore case in searches-
set smartcase                  " unless you enter a capital letter
set ls=2                       " shows statusline always
set nu                         " number lines
set scrolloff=5                " start scrolling when 5 lines from margins
set t_Co=256
set background=dark
colorscheme Tomorrow-Night-Eighties

" Switch syntax highlighting on, when the terminal has colors
" Also switch on highlighting the last used search pattern.
if &t_Co > 2 || has("gui_running")
  syntax on
  set hlsearch
endif

" use gf to open files under cursor, search in separate directories
let &path.="src/include,/usr/include/AL,"

filetype plugin on
set omnifunc=syntaxcomplete#Complete

"                  ====================
"                ~ =      Vundle      = ~
"                  ====================
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" let Vundle manage Vundle
Plugin 'VundleVim/Vundle.vim'

" All mah plugins: 
Plugin 'chriskempson/base16-vim'
Plugin 'Townk/vim-autoclose'
"Plugin 'kien/ctrlp.vim'
"Plugin 'scrooloose/nerdcommenter'
"Plugin 'scrooloose/nerdtree'
"Plugin 'scrooloose/syntastic'
"Plugin 'majutsushi/tagbar'
"Plugin 'tpope/vim-abolish'
"Plugin 'tpope/vim-fugitive'
"Plugin 'tpope/vim-surround'

"================= Autocommand Stuff ====================

" Only do this part if compiled with support for autocommands.
if has("autocmd")

  " Enable file type detection.
  " Use the default filetype settings, so that mail gets 'tw' set to 72,
  " 'cindent' is on in C files, etc.
  " Also load indent files, to automatically do language-dependent indenting.
  filetype plugin indent on

  " Put these in an autocmd group, so that we can delete them easily.
  augroup vimrcEx
  au!

  " For all text files set 'textwidth' to 78 characters.
  autocmd FileType text setlocal textwidth=78

  " When editing a file, always jump to the last known cursor position.
  " Don't do it when the position is invalid or when inside an event handler
  " (happens when dropping a file on gvim).
  " Also don't do it when the mark is in the first line, that is the default
  " position when opening a file.
  autocmd BufReadPost *
    \ if line("'\"") > 1 && line("'\"") <= line("$") |
    \   exe "normal! g`\"" |
    \ endif

  augroup END

  " change status line color based on mode
  hi statusline term=reverse ctermfg=0 ctermbg=2
  au InsertEnter * hi statusline term=reverse ctermbg=4 gui=undercurl guisp=Magenta
  au InsertLeave * hi statusline term=reverse ctermfg=0 ctermbg=2 gui=bold,reverse

else

  set autoindent        " always set autoindenting on

endif " has("autocmd")

"========================================================

"                  ====================
"                ~ =    Whitespace    = ~
"                  ====================


set tabstop=4                  " tab character is 4 columns
set softtabstop=4              " tab key indents 4
set shiftwidth=4               " ==, <<, and >> indent 4 columns
set noexpandtab                  " tab characters turn into spaces


"========== TextMate-Style Visible Whitespace ===========

" Shortcut to rapidly toggle `set list`
"nmap <leader>t :set list!<CR>

" Use cool symbols for tabstops and EOLs
"set listchars=tab:▸\ ,eol:¬

"========================================================


"===== Change Whitespace Settings Based on Filetype =====

" Only do this part when compiled with support for autocommands
if has("autocmd")
  " Enable file type detection
  filetype on

  " Syntax of these languages is fussy over tabs Vs spaces
  autocmd FileType make setlocal ts=8 sts=8 sw=8 noexpandtab
  autocmd FileType yaml setlocal ts=2 sts=2 sw=2 expandtab

  " Customisations based on house-style (arbitrary)
  autocmd FileType html setlocal ts=2 sts=2 sw=2 expandtab
  autocmd FileType css setlocal ts=2 sts=2 sw=2 expandtab
  autocmd FileType javascript setlocal ts=4 sts=4 sw=4 noexpandtab
  autocmd FileType python setlocal ts=4 sts=4 sw=4 noexpandtab
  autocmd FileType lilypond setlocal ts=2 sts=2 sw=2

  " Treat .rss files as XML
  autocmd BufNewFile,BufRead *.rss setfiletype xml

endif

"========================================================


"=============== Strip Trailing Whitespace ==============

function! <SID>StripTrailingWhitespaces()
    " Preparation: save last search, and cursor position.
    let _s=@/
    let l = line(".")
    let c = col(".")
    " Do the business:
    %s/\s\+$//e
    " Clean up: restore previous search history, and cursor position
    let @/=_s
    call cursor(l, c)
endfunction

"========================================================



"                  ====================
"                ~ =   Key Mappings   = ~
"                  ====================


"======================= General ========================

" Don't use Ex mode, use Q for quick macro
map Q @q

" Y to yank to end of line. use yy for yanking whole line
map Y y$

" accidentally entering capital q won't hurt anyone
cnoreabbrev Q q

" press space to center screen on cursor
nmap <space> zz
" searching will keep cursor on middle of screen
nnoremap n nzz
nnoremap N Nzz
nnoremap * *zz
nnoremap # #zz

" maps jk to escape key in insert mode
"imap jk <Esc>

" <Leader>s to toggle syntax on/off
nnoremap <Leader>s :call SyntaxToggle()<CR>

" <Leader>cd to move to file's working directory
nnoremap <Leader>cd :lcd %:h<CR>

" For LilyPond - insert version number and start
nnoremap <leader>l i\version<Space>""<Esc>:read<Space>!lilypond<Space>-v<Bar>ag<Space>LilyPond<Bar>cut<Space>-c<Space>14-20<CR>vawdkf"pjo{}<Esc>i<CR><Esc>O

"========================================================


"================= Windows and Buffers ==================

" New vertical split with <Leader>wv
nnoremap <Leader>wv <C-w>v<C-w>l

" Close windows with <Leader>wc
nnoremap <Leader>wc <C-w>c

" move between windows with arrow keys or <Leader>w + hjkl
nnoremap <Left> <C-w>h
nnoremap <Down> <C-w>j
nnoremap <Up> <C-w>k
nnoremap <Right> <C-w>l
nnoremap <Leader>wh <C-w>h
nnoremap <Leader>wj <C-w>j
nnoremap <Leader>wk <C-w>k
nnoremap <Leader>wl <C-w>l

" move between buffers with <Leader>left/right
nnoremap <silent> <Leader><Left> :bp<CR>
nnoremap <silent> <Leader><Right> :bn<CR>

" <Leader>y to switch between two most recent buffers
nmap <Leader>y :b#<CR>

" <Leader>ev to edit vimrc in vertical split
nnoremap <Leader>ev <C-w><C-v><C-w><C-l>:e $MYVIMRC<CR>

" <Leader>sv to source the vimrc
nnoremap <Leader>sv :source<Space>$MYVIMRC<CR>

"========================================================


"==================== Function Keys =====================

" delete whitespace at eols with F9
nnoremap <silent> <F9> :call <SID>StripTrailingWhitespaces()<CR>

" F10 will search help for the word under the cursor
nnoremap <F10> :help <C-r><C-w><CR>

"========================================================


"====================== C Stuff =========================

" Open definition in split with <Leader>/
nnoremap <Leader>/ :vsp<CR> :exec("tag ".expand("<cword>"))<CR>


"========================================================


"====================== Fugitive ========================

" Edit Git Files
nnoremap <Leader>ge :Gedit<CR>
nnoremap <Leader>gh :Gsplit<CR>
nnoremap <Leader>gv :Gvsplit<CR>

" Git Diff
nnoremap <Leader>gd :Gdiff<CR>

" Git Status
nnoremap <Leader>gs :Gstatus<CR>

" Commit
nnoremap <Leader>gc :Gcommit<CR>

" Git Blame
nnoremap <Leader>gb :Gblame<CR>

" Git Move and Remove
nnoremap <Leader>gm :Gmove<CR>
nnoremap <Leader>gr :Gremove<CR>

"========================================================

"==================== X11 Clipboard =====================
"
" CTRL-X and SHIFT-Del are Cut in visual mode
vnoremap <C-X> "+x
vnoremap <S-Del> "+x

" CTRL-C and CTRL-Insert are Copy in visual mode
vnoremap <C-C> "+y
vnoremap <C-Insert> "+y

" CTRL-V and SHIFT-Insert are Paste
" map <C-V>       "+gP
map <S-Insert>      "+gP

cmap <C-V>      <C-R>+
cmap <S-Insert>     <C-R>+

"========================================================

"========================= Misc =========================

" CTRL-U in insert mode deletes a lot.  Use CTRL-G u to first break undo,
" so that you can undo CTRL-U after inserting a line break.
inoremap <C-U> <C-G>u<C-U>

" function to toggle syntax on and off
function! SyntaxToggle()
    if(&syntax == 1)
        syntax off
    else
        syntax on
    endif
endfunc

" hide search hl with ctrl+l
nnoremap <silent> <C-l> :<C-u>nohlsearch<CR><C-l>

" LilyPond stuff
"set runtimepath+=/usr/share/lilypond/2.16.0/vim/

" LaTex stuff
"set grepprg=grep\ -nH\ $*
let g:tex_flavor = "latex"
let g:Tex_DefaultTargetFormat = 'pdf'
let g:Tex_MultipleCompileFormats= 'pdf, aux'

"========================================================
