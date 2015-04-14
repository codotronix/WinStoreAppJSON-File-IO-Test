$(function () {

    var saveFile;    
    var FileDataObj;
    createOpenSavedFile();

    function createOpenSavedFile() {
        console.log('create/open function is called');
        Windows.Storage.ApplicationData.current.localFolder.createFileAsync("SavedGameData.txt",
           Windows.Storage.CreationCollisionOption.openIfExists).then(function (file) {
               saveFile = file;
               console.log('File opened successfully...');
               readScoresFromFile();               
           });
    }

    function writeToFile(someText) {
        console.log('write function is called');
        Windows.Storage.FileIO.writeTextAsync(saveFile, someText).then(function () {
            console.log('Written successfully ' + someText);
            updateLeaderBoard();
        });
    }

    function readScoresFromFile() {
        console.log('read function is called');
        Windows.Storage.FileIO.readTextAsync(saveFile).then(function (contents) {            
            console.log('file read successfully... <contents>' + contents + '</contents>');
            // Add code to process the text read from the file            
            if (contents.trim().length <= 0) {
                //yes this is a newly created file, so initialize FileDataObj
                FileDataObj = {
                    'Level_1': [0, 0, 0],
                    'Level_2': [0, 0, 0],
                    'Level_3': [0, 0, 0],
                    'Level_4': [0, 0, 0]
                };
                
                //console.log(JSON.stringify(FileDataObj));
                updateLeaderBoard();
                var stringObj = JSON.stringify(FileDataObj);
                writeToFile(stringObj);

                console.log('Empty file read. Hence calling write function with data <content>' + stringObj + '</content>');
            }
            else {
                //$('#statusMsg').append("<br/> Existing File. Contents = " + contents);
                //contents = "'" + contents + "'";
                console.log('Non Empty File Found...');
                FileDataObj = JSON.parse(contents);
                console.log('And after JSON.parse that non empty file, we got = ' + FileDataObj);
                //$('#statusMsg').append("<br/>  Read Content = " + FileDataObj.Level_1);
            }

            updateLeaderBoard();
        });
    }

    function resetFileData() {
        console.log('reset function is called');
        Windows.Storage.FileIO.writeTextAsync(saveFile, '').then(function () {
            //console.log('done reseting the file...');
            //$('#statusMsg').append('<br/> File reset Successfull...');
            readScoresFromFile();
        });
    }

    function updateLeaderBoard() {
        console.log('update leaderboard function is called');
        var htmlString = '<br/>'
                        + '<h1>High Scores</h1>'
                        + '<br/><br/>'
                        + '<table>'

        for (var i = 1; i <= 4; i++) {
            var level = "Level_" + i;
            htmlString += '<tr><td colspan="3">LEVEL ' + i + ' </td></tr>'
                          + '<tr>';
            for (var j = 0; j < 3; j++) {
                htmlString += '<td>' + FileDataObj[level][j] + '</td>';
            }
            htmlString += '</tr>';
        }

        htmlString += '</table>';

        $('#ScoreField').html(htmlString);
    }

    $('#btnReset').click(function () {
        resetFileData();
    });

    $('#btnRead').click(function () {
        readScoresFromFile();
    });

    $('#showScores').click(function () {
        updateLeaderBoard();
    });

    $('#btnSave').click(function () {
        var newLevel = $('#playerLevel').val();
        var newScore = $('#playerScore').val();
        var level = 'Level_' + newLevel;
        var isModified = false;
        for (var i = 2; i >= 0; i--) {
            if (parseInt(FileDataObj[level][i]) < newScore) {
                FileDataObj[level][i] = newScore;
                isModified = true;
                break;
            }
        }
        console.log('inside BtnSave function, FileDataObj = ' + FileDataObj);
        //now sort the scores Greater to lesser
        for (var j = 1; j <= 2; j++){
            for (var k = 2; k >= j; k--) {
                if (parseInt(FileDataObj[level][k]) > parseInt(FileDataObj[level][k - 1])) {
                    var temp = FileDataObj[level][k];
                    FileDataObj[level][k] = FileDataObj[level][k - 1];
                    FileDataObj[level][k - 1] = temp;
                }
            }
        }

        writeToFile(JSON.stringify(FileDataObj));
    });
});