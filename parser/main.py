from parser import parser
import sys
import re
def main():
 file_name = sys.argv[1] if len(sys.argv)>1 else 'input.txt'
    #s = scanner(file_name) 
    #tokens, types = s.arrOut()
 types= []
 tokens = []
 file = open(file_name,"r")
 linedata = filter(None, (line.rstrip() for line in file))
 
 for word in linedata:
   data=word.split(",")
   t_type=data[0].strip()
   t_value = data[1].strip()
   data[0]=t_type
   data[1]=t_value
   types.append(data[0])
   tokens.append(data[1])
#  print (data)
#  print("t_value:" + t_value+ " t_type:" + t_type)   
 file.close()
 #types=data[0]
 #tokens=data[1]
 #print(types)
 #print(tokens)
 p = parser(tokens, types)
 p.drow()

if __name__ == "__main__":
    main()
