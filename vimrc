" Maintainer:	Bram Moolenaar <Bram@vim.org>
" Last change:	2011 Apr 15
"
" When started as "evim", evim.vim will already have done these settings.
if v:progname =~? "evim"
  finish
endif

" Use Vim settings, rather than Vi settings (much better!).
" This must be first, because it changes other options as a side effect.
set nocompatible

" allow backspacing over everything in insert mode
set backspace=indent,eol,start

if has("vms")
  set nobackup		" do not keep a backup file, use versions instead
else
  set backup		" keep a backup file
endif
set backupdir=~/.vim/backup   " send backup files to .vim/backup
set noswapfile          " disable saving swap files
set history=50		" keep 50 lines of command line history
set ruler		" show the cursor position all the time
set showcmd		" display incomplete commands
set incsearch		" do incremental searching
set rnu                 " relative number lines
set ignorecase
set smartcase
set shiftwidth=4        " ==, <<, and >> indent 4 spaces
set softtabstop=4       " tab key indents 4

" open paren will add close paren and put cursor in between
inoremap ( ()<Esc>i
" same, with others
inoremap [ []<Esc>i
inoremap { {}<Esc>i
inoremap " ""<Esc>i
" inoremap < <><Esc>i

" toggle nerdtree with ctrl + n
map <F7> :NERDTreeToggle<CR> 

" toggle tagbar with f8
nmap <F8> :TagbarToggle<CR>

set t_Co=256
set bg=dark
colorscheme Tomorrow-Night-Eighties

" For Win32 GUI: remove 't' flag from 'guioptions': no tearoff menu entries
" let &guioptions = substitute(&guioptions, "t", "", "g")

" Don't use Ex mode, use Q for formatting
map Q gq

" If the current buffer has never been saved, it will have no name,
" call the file browser to save it, otherwise just save it.
command -nargs=0 -bar Update if &modified 
                           \|    if empty(bufname('%'))
                           \|        browse confirm write
                           \|    else
                           \|        confirm write
                           \|    endif
                           \|endif
nnoremap <silent> <C-S> :<C-u>Update<CR>
" Ctrl-s to save while in insert mode
inoremap <c-s> <c-o>:Update<CR>

" insert new line without entering insert mode. enter for below and shift-enter for above 
map <S-Enter> O<Esc>
map <CR> o<Esc>

" :q and :Q will always quit all
map :q :qa
map :Q :q

" CTRL-X and SHIFT-Del are Cut
vnoremap <C-X> "+x
vnoremap <S-Del> "+x

" CTRL-C and CTRL-Insert are Copy
vnoremap <C-C> "+y
vnoremap <C-Insert> "+y

" CTRL-V and SHIFT-Insert are Paste
map <C-V>   	"+gP
map <S-Insert>  	"+gP

cmap <C-V>  	<C-R>+
cmap <S-Insert> 	<C-R>+

" CTRL-U in insert mode deletes a lot.  Use CTRL-G u to first break undo,
" so that you can undo CTRL-U after inserting a line break.
inoremap <C-U> <C-G>u<C-U>

" disable arrow keys in normal mode
" inoremap <up> <nop>
" inoremap <down> <nop>
" inoremap <left> <nop>
" inoremap <right> <nop>

" press space to center screen on cursor
nmap <space> zz
" n will keep cursor on middle of screen
nmap n nzz
nmap N Nzz

" maps jj to escape key in insert mode
imap jk <Esc>

" hide search hl with ctrl + ,
map <C-n> :nohl<CR>

" toggle rnu with ctrl + h
function! NumberToggle()
  if(&relativenumber == 1)
    set number
  else
    set relativenumber
  endif
endfunc

nnoremap <C-h> :call NumberToggle()<cr>

" in insert mode, auto turn on absolute numbered lines
autocmd InsertEnter * :set number
autocmd InsertLeave * :set relativenumber

" In many terminal emulators the mouse works just fine, thus enable it.
if has('mouse')
  set mouse=c " I have it disabled here
endif

" Switch syntax highlighting on, when the terminal has colors
" Also switch on highlighting the last used search pattern.
if &t_Co > 2 || has("gui_running")
  syntax on
  set hlsearch
endif

" Only do this part when compiled with support for autocommands.
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

else

  set autoindent		" always set autoindenting on

endif " has("autocmd")

" Convenient command to see the difference between the current buffer and the
" file it was loaded from, thus the changes you made.
" Only define it when not defined already.
if !exists(":DiffOrig")
  command DiffOrig vert new | set bt=nofile | r ++edit # | 0d_ | diffthis
		  \ | wincmd p | diffthis
endif

" lilypond compatibility
filetype off
set runtimepath+=/usr/local/share/lilypond/current/vim/
filetype on