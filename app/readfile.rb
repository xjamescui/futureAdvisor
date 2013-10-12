#!/usr/bin/ruby -w

#
# Takes the data TXT file and parse it into a JSON file
#

if(File.file?('data.txt'))

	counter = 1
	file = File.open("data.txt", "r")
	jsonFile = File.new("data.json", "w")
	name = ''
	code=''
	data=''
	delimiter ="|"
	delimiterIndex=0

	#begin of JSON: open bracket
	jsonFile.write("{ \"values\": [\n");

	while ( line = file.gets)

		#get firm name
		jsonFile.write("{\n")
		delimiterIndex = line.index(delimiter)
		name = line[0 ,delimiterIndex].lstrip.rstrip
		line = line[delimiterIndex+1, line.length]		
		jsonFile.write('"name": "'+name+"\",\n")

		# get firm short code
		delimiterIndex = line.index(delimiter)
		code = line[0 ,delimiterIndex].lstrip.rstrip
		line = line[delimiterIndex+1, line.length]
		jsonFile.write('"code": "'+code+"\",\n")

		# get data array
		data = line.lstrip.rstrip
		jsonFile.write('"numbers": '+data+"\n")
		jsonFile.write("}")

		#put a comma before next iteration if this not the last thing we will add
		if(!file.eof?)
			jsonFile.write(",")
		end

		jsonFile.write("\n")

	end

	#end of JSON: closing bracket
	jsonFile.write(']}')

	file.close
	jsonFile.close
end

