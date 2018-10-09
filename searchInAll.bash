#!/bin/bash
set -o pipefail
REDO=false
##
## This file run parser on all raw output based on thier names and return one JSON file to standard output
## params: - output folder of the raw files - input file
##
if [ -z "$2" ]; then
	echo "usage: ./searchInAll.bash outputsFolder sourceFile";
	exit 2;
fi

if [ -z "$1" ]; then
	echo "usage: ./searchInAll.bash outputsFolder sourceFile";
	exit 1;
fi

TMP=$( cd $(dirname $1) ; pwd -P )
TMP2=$( basename $1 )
OUTPUTS="$TMP/$TMP2"

TMP=$( cd $(dirname $2) ; pwd -P )
TMP2=$( basename $2 )
SOURCE="$TMP/$TMP2"

BIN_PATH='/home/leeds/ArabicMorphologyTools/bin/'
# SEP=","
# echo "{"

#cleaning old way
if [ -e $OUTPUTS/AraComLex ]; then mv $OUTPUTS/AraComLex  $OUTPUTS/AR; fi;
if [ -e "$OUTPUTS/$TMP2.mada" ]; then mv "$OUTPUTS/$TMP2.mada"  $OUTPUTS/MA; fi;
if [ -e $OUTPUTS/mada ]; then mv $OUTPUTS/mada $OUTPUTS/MD; fi;
if [ -e $OUTPUTS/madamira ]; then mv $OUTPUTS/mada $OUTPUTS/MA; fi;
if [ -e $OUTPUTS/xerox.json ]; then mv $OUTPUTS/xerox.json  $OUTPUTS/XE; fi;
if [ -e $OUTPUTS/AlKhalil ]; then mv $OUTPUTS/AlKhalil  $OUTPUTS/KH; fi;
if [ -e $OUTPUTS/elixir ]; then mv $OUTPUTS/elixir  $OUTPUTS/EX; fi;
if [ -e $OUTPUTS/buckwalter1.0 ]; then mv $OUTPUTS/buckwalter1.0  $OUTPUTS/BP; fi;
if [ -e $OUTPUTS/javaBW ]; then  mv $OUTPUTS/javaBW  $OUTPUTS/BJ; fi;
if [ -e $OUTPUTS/stanford ]; then mv $OUTPUTS/stanford  $OUTPUTS/ST; fi;
if [ -e $OUTPUTS/amira ]; then mv $OUTPUTS/amira  $OUTPUTS/AM; fi;
if [ -e $OUTPUTS/atks.json ]; then mv $OUTPUTS/atks.json  $OUTPUTS/MS; fi;
if [ -e $OUTPUTS/QAC.json ]; then mv $OUTPUTS/QAC.json  $OUTPUTS/QC; fi;
if [ -e $OUTPUTS/QC ]; then mv $OUTPUTS/QC  $OUTPUTS/QA; fi;
if [ -e $OUTPUTS/marmot ]; then mv $OUTPUTS/marmot  $OUTPUTS/MR; fi;
if [ -e $OUTPUTS/Qutuf ]; then mv $OUTPUTS/Qutuf  $OUTPUTS/QT; fi;

if [ -e $OUTPUTS/AR ]; then
	# echo "\"AR\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/AR.json ]] ||  ( cat $OUTPUTS/AR | node $BIN_PATH/resultsParser.js AraComLex   | tee $OUTPUTS/AR.json | tee $OUTPUTS/AR.json ) >/dev/null # || echo "[]"
	# echo $SEP;
fi

if [ -e $OUTPUTS/MD ]; then
	# echo "\"MD\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/MD.json ]] ||  ( cat $OUTPUTS/MD | sed '/^_/ d' | node $BIN_PATH/resultsParser.js Mada   | tee $OUTPUTS/MD.json ) >/dev/null # || echo "[]"

	# echo $SEP;
fi

if [ -e $OUTPUTS/MA ]; then
	# echo "\"MA\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/MA.json ]] ||  ( cat $OUTPUTS/MA | sed '/^_/ d' | node $BIN_PATH/resultsParser.js MADAMIRA   | tee $OUTPUTS/MA.json  ) >/dev/null # || echo "[]"


	# echo $SEP;
fi

if [ -e $OUTPUTS/AL ]; then
	# echo "\"AL\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/AL.json ]] ||  ( cat $OUTPUTS/AL | node $BIN_PATH/resultsParser.js AL   | tee $OUTPUTS/AL.json  ) >/dev/null # || echo "[]"


	# echo $SEP;
fi


if [ -e $OUTPUTS/XE ]; then
	# echo "\"XE\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/XE.json ]] ||  ( cat $OUTPUTS/XE | node $BIN_PATH/resultsParser.js Xerox   | tee $OUTPUTS/XE.json  ) >/dev/null # || echo "[]"

	# echo $SEP;
fi

if [ -e $OUTPUTS/KH ]; then
	# echo "\"KH\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/KH.json ]] ||  ( cat $OUTPUTS/KH | node $BIN_PATH/resultsParser.js AlKhalil   | tee $OUTPUTS/KH.json  ) >/dev/null # || echo "[]"

	# echo $SEP;
fi

if [ -e $OUTPUTS/EX ]; then
	# echo "\"EX\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/EX.json ]] ||  ( cat $OUTPUTS/EX | node $BIN_PATH/resultsParser.js Elixir  | tee $OUTPUTS/EX.json  ) >/dev/null # || echo "[]"

	#echo $SEP;
	#echo "\"ATB\":"
	#( cat $OUTPUTS/madamira.ATB4MT.tok | tr -d "\r" | node $BIN_PATH/resultsParser.js ATB4MT   | tee $OUTPUTS/AR.json  ) >/dev/null # || echo "[]"

	# echo $SEP;
fi

if [ -e $OUTPUTS/BP ]; then
	# echo "\"BP\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/BP.json ]] ||  ( cat $OUTPUTS/BP | iconv -f WINDOWS-1256 -t utf-8 |  tr -d "\r" | node $BIN_PATH/resultsParser.js BW  | tee $OUTPUTS/BP.json  ) >/dev/null # || echo "[]"

	# echo $SEP;
fi

if [ -e $OUTPUTS/BJ ]; then
	# echo "\"BJ\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/BJ.json ]] ||  ( cat $OUTPUTS/BJ | sed 's/\t/\\t/g' | node $BIN_PATH/resultsParser.js BWJAVA  | tee $OUTPUTS/BJ.json  ) >/dev/null # || echo "[]"

	# echo $SEP;
fi

if [ -e $OUTPUTS/ST ]; then
	# echo "\"ST\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/ST.json ]] ||  ( cat $OUTPUTS/ST | node $BIN_PATH/resultsParser.js Stanford $SOURCE  | tee $OUTPUTS/ST.json ) >/dev/null # || echo "[]" 


	# echo $SEP;
fi

if [ -e $OUTPUTS/AM ]; then
	# echo "\"AM\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/AM.json ]] ||  ( cat $OUTPUTS/AM | node $BIN_PATH/resultsParser.js AMIRA $SOURCE  | tee $OUTPUTS/AM.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/MS ]; then
	# echo "\"MS\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/MS.json ]] ||  ( cat $OUTPUTS/MS | node $BIN_PATH/resultsParser.js MS  | tee $OUTPUTS/MS.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/MS ]; then
	# echo "\"MT\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/MT.json ]] ||  ( cat $OUTPUTS/MS | node $BIN_PATH/resultsParser.js MT  | tee $OUTPUTS/MT.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/QA ]; then
	# echo "\"QA\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/QA.json ]] ||  ( cat $OUTPUTS/QA | tr -d "\r" |node $BIN_PATH/resultsParser.js QAC  | tee $OUTPUTS/QA.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/QT ]; then
	# echo "\"QT\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/QT.json ]] ||  ( cat $OUTPUTS/QT | xml-json Word | node $BIN_PATH/resultsParser.js QT  | tee $OUTPUTS/QT.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/SW ]; then
	# echo "\"SW\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/SW.json ]] ||  ( cat $OUTPUTS/SW | node $BIN_PATH/resultsParser.js Sawalha  | tee $OUTPUTS/SW.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/MR ]; then
	# echo "\"MR\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/MR.json ]] ||  ( cat $OUTPUTS/MR | node $BIN_PATH/resultsParser.js MR $SOURCE  | tee $OUTPUTS/MR.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

if [ -e $OUTPUTS/WP ]; then
	# echo "\"WP\":" | tee /dev/tty
	[[ ! $REDO && -f $OUTPUTS/WP.json ]] ||  ( cat $OUTPUTS/WP | node $BIN_PATH/resultsParser.js WP $SOURCE  | tee $OUTPUTS/WP.json ) >/dev/null # || echo "[]" 
	# echo $SEP;
fi

# echo "\"Raw\":" | tee /dev/tty
[[ ! $REDO && -f $OUTPUTS/RAW.json ]] || ( cat "$SOURCE" | node $BIN_PATH/resultsParser.js RAW | tee $OUTPUTS/Raw.json ) >/dev/null # || echo "[]"

node resultCombiner.js $OUTPUTS
# echo "}"