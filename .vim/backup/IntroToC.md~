NOTES - 2017/01/18

##Assembly

The machines only understand binary. We can translate the binary by reading
bytes at a time. Certain bytes give instructions to the hardware. These
special bytes are called instructions: "var  DB  64" - Create a byte called
var containing the value 64. 
Each hardware architecture has its own set of instructions, this is why
compiled languages need their own compiler for each piece of hardware.

##Linking Process

Compiled files become object files. .obj files contain the conversion from
C to assembly. When the object file is created, it more than likely
references other codes and libraryes. printf() is a function that exists
in another object file and must be referenced. Once all library calls are
linked, a final .exe is made to run on the machine.

##Variables

Global variables are universal to the program. All functions can use the
same variables. These exist in a fixed memory location once compiled
and run.

Local variables exist only within a function in which it is declared.
They are scoped to that function or block. Exist in memory on the run-time
stack.

Dynamic variables (or more properly, their data) exist in heap memory. 
Memory that is not allocated when the process starts but during runtime.

##Basic IO

scanf(const char *format, ...)

The first argument is a c-style string that specifies the format
of the values to read. Next arguments (any number) are the variables
to read the value into.

printf(const char *format, ...)

First arguement is the string to print along with the format of the
following variables. Next arguments are the variables to read.
