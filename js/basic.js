var manager = [];
var rightBarShow = false;
var currentTaskList = 0 ;
function addTaskList () {
	var topic  = document.getElementById('newTaskListTopic').value;
	if ( topic === '' )
		return;
	var taskList = {};
	taskList.topic = topic;
	taskList.tasks = [];
	manager.push ( taskList );
	localStorage.setItem ( 'taskManager' , JSON.stringify(manager) );
	var pos = manager.length - 1;
	createTaskListView( pos , topic );
}

function addTask () {
	var content = document.getElementById('newTaskContent').value;
	var pos = currentTaskList;
	if ( content === '' )
		return;
	var task = {};
	task.topic = content;
	task.isDone = false;
	manager[pos].tasks.push ( task );
	localStorage.setItem ( 'taskManager' , JSON.stringify(manager) );
	var taskIndex = manager[pos].tasks.length - 1;
	createTaskGridView ( pos , taskIndex , content );
}

function retrieveTaskList () {
	for (var i = 0; i < manager.length; i++) {
		createTaskListView(i , manager[i].topic);
	}
	if ( manager.length )
		retrieveTask ( manager.length - 1 );
}

function retrieveTask (pos) {
	var heading = document.getElementById ( 'taskList-topic-selected' );
	var taskGenerator = document.getElementById ( 'new-task-generator' );
	var layout = document.getElementById ( 'task-container' );
	layout.innerHTML = '';
	layout.appendChild(heading);
	layout.appendChild(taskGenerator);
	var taskList = manager[pos].tasks;
	for (var i = 0; i < taskList.length; i++) {
		createTaskGridView ( pos , i , taskList[i].topic);
	}
}

function createTaskListView (pos,topic) {
	
	//create the container for tasklist which will contain all the below elements
	var cardElement = document.createElement ( 'div' );
	cardElement.setAttribute ( 'class' , 'taskList' );
	
	// create heading
	var cardHeading = document.createElement ( 'div' );
	cardHeading.setAttribute ( 'class' , 'task-list-heading' );
	
	//create toolbar
	var toolbar = document.createElement ( 'div' );
	toolbar.setAttribute ( 'class' , 'task-list-toolbar' );
	
	// create text node containing topic of tasklist
	var headingText = document.createTextNode ( topic );
	
	// put task topic text into heading 
	cardHeading.appendChild ( headingText );
	
	cardElement.appendChild ( cardHeading );
	
	// create edit button
	var edit = document.createElement ( 'i' );
	edit.setAttribute ( 'task-action' , 'edit' );
	edit.setAttribute ( 'class' , 'fa fa-pencil-square-o edit' );
	
	// create delete button
	var del = document.createElement ( 'i' );
	del.setAttribute ( 'class' , 'fa fa-minus-square del' );
	del.setAttribute ( 'task-action' , 'delete' );

	// putting all edit del button inside toolbar
	toolbar.appendChild( edit );
	toolbar.appendChild( del );
	
	cardElement.appendChild ( toolbar );
	var taskListContainer = document.getElementById ( 'task-list-container' );
	taskListContainer.insertBefore ( cardElement , taskListContainer.childNodes[0] );
}

function createTaskGridView (pos,taskIndex,task) {
	// creating the task cotainer -- will be full card to be shown as task
	var taskGrid = document.createElement ('section');
	taskGrid.setAttribute ( 'class' , 'task' );
	taskGrid.setAttribute ( 'id' , 'list-' + pos + '-task-' + taskIndex );

	// creating the task content container -- will be child of task container
	var taskContent = document.createElement( 'div' );
	taskContent.setAttribute ( 'class' , 'task-content' );
	taskContent.setAttribute ( 'id' , 'list-' + pos + '-task-content-' + taskIndex );

	// creating the task toolbar to delete or edit or mark as done -- will be child of task container
	var toolbar = document.createElement( 'div' );
	toolbar.setAttribute ( 'class' , 'task-toolbar' );
	toolbar.setAttribute ( 'id' , 'list-' + pos + '-toolbar-' + pos );

	// creating the text node containing the task
	var content = document.createTextNode ( task );

	// putting content in content container 
	taskContent.appendChild ( content );

	// create done button
	var done = document.createElement ( 'i' );
	done.setAttribute ( 'class' , 'fa fa-check-circle-o done' );
	done.setAttribute ( 'id' , 'list-' + pos + '-done-' + taskIndex );

	// create edit button
	var edit = document.createElement ( 'i' );
	edit.setAttribute ( 'class' , 'fa fa-pencil-square-o edit' );
	edit.setAttribute ( 'id' , 'list-' + pos + '-edit-' + taskIndex );

	// create delete button
	var del = document.createElement ( 'i' );
	del.setAttribute ( 'class' , 'fa fa-minus-square del' );
	del.setAttribute ( 'id' , 'list-' + pos + '-del-' + taskIndex );

	// putting all edit del done button inside toolbar
	toolbar.appendChild( done );
	toolbar.appendChild( edit );
	toolbar.appendChild( del );


	// putting the task tool bar in task container -- first child of task container
	taskGrid.appendChild ( toolbar );

	// putting the  content container in task container -- second child of task container
	taskGrid.appendChild ( taskContent );

	// put all the things together in the dashboard to show the different grid for different task of a list
	var taskBoard = document.getElementById ( 'task-container' );
	taskBoard.insertBefore ( taskGrid , taskBoard.childNodes[4] );
}


function toggleCustomiser () {
	if ( rightBarShow ) {
		document.getElementById ( 'right-bar' ).style.right = '-200px';
		rightBarShow = false;
	} else {
		document.getElementById ( 'right-bar' ).style.right = '0px';
		rightBarShow = true;		
	}
}

function getCustomiser () {
	var customiserList = document.getElementsByClassName ( 'back-cover' );
	for (var i = 0; i < customiserList.length; i++) {
		customiserList[i].style.backgroundImage = " url( 'img/"+customiserList[i].childNodes[0].value+"' ) ";

	}
}



window.onload = function () {
	if( localStorage.getItem('taskManager') != null){
		manager = JSON.parse(localStorage.getItem('taskManager'));
	}
	retrieveTaskList();
	getCustomiser();

	// event handling for changing background images
	var customiserParent = document.getElementById ( 'customiser-parent' );
	customiserParent.onclick = function ( e ) {
		if(event.srcElement.getAttribute('class') === "back-cover") {
			var target = event.srcElement; 
			document.body.style.backgroundImage = target.style.backgroundImage;
		}
	} 

	// event handling for tasklists
	var taskListContainer = document.getElementById( 'task-list-container' );
	taskListContainer.onclick = function ( e ) {

		var card = event.srcElement;
		while( card !=null  && card.getAttribute ( 'class' ) !=  'taskList' ){
			if ( card.getAttribute ( 'class' ) === 'list-container' )
				return;
			card = card.parentNode;
		}
		var taskListArray = card.parentNode.children;
		var pos = 0;
		for (var i = 0; i < taskListArray.length; i++) {
			if( taskListArray[i] == card )
				pos = taskListArray.length - 1 - i;
		}	
		if ( event.srcElement.hasAttribute ( 'task-action' ) ) {
			var action = event.srcElement.getAttribute ( 'task-action' );
			console.log(pos);
			if ( action === 'delete') {
				manager.splice ( pos , 1 );
				localStorage.setItem ( 'taskManager' , JSON.stringify(manager) );
				card.parentNode.removeChild ( card );
			} else if ( action == 'edit') {
				alert('edit');
			}
		} else {
			console.log(pos);
			document.getElementById ( 'taskList-topic-selected' ).innerHTML = manager[pos].topic;
			currentTaskList = pos;
			retrieveTask ( pos );
		}
	}

	// handling the change of topic 
	document.getElementById( '' )
	// event handling for tasks
	var taskContainer = document.getElementById( 'task-container' );
	taskContainer.onclick = function ( e ) {
	}
}



