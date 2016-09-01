var manager = [];
var rightBarShow = false;
var leftBarShow = false;
var profileManager = {cover:'none'};
var currentTaskList = 0 ;
var taskToEdit;
var	taskListToedit;
function addTaskList () {
	var topic  = document.getElementById('newTaskListTopic').value;
	if ( topic.trim() === '' ){
		document.getElementById ( 'tasklist-error-msg' ).innerHTML = 'can you please type something ? ';
		return;
	} else if ( topic.length > 200 ){
		document.getElementById ( 'tasklist-error-msg' ).innerHTML = 'Oops !!! being verbose , try to cut it in short ';
		return;
	}
	var taskList = {};
	taskList.topic = topic;
	taskList.tasks = [];
	manager.push ( taskList );
	saveData();
	var pos = manager.length - 1;
	createTaskListView( pos , topic );
	currentTaskList = pos;
	retrieveTask ( pos );
}

function addTask () {
	var content = document.getElementById('newTaskContent').value;
	var pos = currentTaskList;
	var msgBox = document.getElementById ( 'task-error-msg' );
	if ( content.trim() === '' ){
		msgBox.innerHTML = 'can you please type something ? ';
		return;
	} else if ( content.length > 200 ){
		msgBox.innerHTML = 'Oops !!! being verbose , try to keep it short ';
		return;
	} else {
		msgBox.innerHTML = ' you added one task , you can also edit , delete or mark it done ';
	}

	var task = {};
	task.topic = content;
	task.isDone = false;
	manager[pos].tasks.push ( task );
	saveData();
	var taskIndex = manager[pos].tasks.length - 1;
	createTaskGridView ( pos , taskIndex , content , task.isDone );
}

function retrieveTaskList () {
	for (var i = 0; i < manager.length; i++) {
		createTaskListView(i , manager[i].topic);
	}
	if ( manager.length )
		retrieveTask ( manager.length - 1 );
	else
		retrieveTask ( 0)
}

function retrieveTask (pos) {
	var heading = document.getElementById ( 'taskList-topic-selected' );
	var taskGenerator = document.getElementById ( 'new-task-generator' );
	var layout = document.getElementById ( 'task-container' );
	if ( manager.length > 0 ) {
		heading.innerHTML = manager[currentTaskList].topic;
		taskGenerator.style.display = 'inline-block';
	} else {	
		heading.innerHTML = 'NO TASK LIST ADDED ';
		taskGenerator.style.display = 'none';
		return;
	}
	heading.innerHTML = manager[pos].topic;
	layout.innerHTML = '';
	layout.appendChild(heading);
	layout.appendChild(taskGenerator);
	var taskList = manager[pos].tasks;
	for (var i = 0; i < taskList.length; i++) {
		createTaskGridView ( pos , i , taskList[i].topic , taskList[i].isDone );
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
	
	// put heading into the tasklist container
	cardElement.appendChild ( cardHeading );
	
	// create edit button
	var edit = document.createElement ( 'i' );
	edit.setAttribute ( 'task-action' , 'edit' );
	edit.setAttribute ( 'class' , 'fa fa-pencil edit' );
	
	// create delete button
	var del = document.createElement ( 'i' );
	del.setAttribute ( 'class' , 'fa fa-trash-o del' );
	del.setAttribute ( 'task-action' , 'delete' );

	// putting all edit del button inside toolbar
	toolbar.appendChild( del );
	toolbar.appendChild( edit );
	
	// putting the toolbar inside the tasklist container
	cardElement.appendChild ( toolbar );

	// here we get our card , putting all the pieces together
	var taskListContainer = document.getElementById ( 'task-list-container' );
	taskListContainer.insertBefore ( cardElement , taskListContainer.childNodes[0] );

	activateTaskList ( cardElement );
}

function createTaskGridView ( pos , taskIndex , task , isDone) {
	// creating the task cotainer -- will be full card to be shown as task
	var taskGrid = document.createElement ('section');
	taskGrid.setAttribute ( 'class' , 'task' );
	if ( isDone )
		taskGrid.setAttribute( 'class' , 'task task-done')
	
	// creating the task content container -- will be child of task container
	var taskContent = document.createElement( 'div' );
	taskContent.setAttribute ( 'class' , 'task-content' );
	
	// creating the task toolbar to delete or edit or mark as done -- will be child of task container
	var toolbar = document.createElement( 'div' );
	toolbar.setAttribute ( 'class' , 'task-toolbar' );
	
	// creating the text node containing the task
	var content = document.createTextNode ( task );

	// putting content in content container 
	taskContent.appendChild ( content );

	// create done button
	var done = document.createElement ( 'i' );
	done.setAttribute ( 'class' , 'fa fa-check-circle-o done' );
	if ( isDone )
		done.setAttribute( 'class' , 'fa fa-check-circle done' );
	done.setAttribute ( 'task-action' , 'done' );

	// create edit button
	var edit = document.createElement ( 'i' );
	edit.setAttribute ( 'class' , 'fa fa-pencil edit' );
	edit.setAttribute ( 'task-action' , 'edit' );

	// create delete button
	var del = document.createElement ( 'i' );
	del.setAttribute ( 'class' , 'fa fa-trash-o del' );
	del.setAttribute ( 'task-action' , 'delete' );


	// putting all edit del done button inside toolbar
	toolbar.appendChild( done );
	toolbar.appendChild( del );
	toolbar.appendChild( edit );
	

	// putting the task tool bar in task container -- first child of task container
	taskGrid.appendChild ( toolbar );

	// putting the  content container in task container -- second child of task container
	taskGrid.appendChild ( taskContent );

	// put all the things together in the dashboard to show the different grid for different task of a list
	var taskBoard = document.getElementById ( 'task-container' );
	taskBoard.insertBefore ( taskGrid , taskBoard.childNodes[2] );
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

function activateTaskList ( child ) {
	var	childrenArray = child.parentNode.children ;
	for (var i = 0; i < childrenArray.length; i++) {
		childrenArray[i].style.boxShadow = 'none';
	}
	child.style.boxShadow = '1px 10px 10px 1px black';

}

function modalOpen ( id , topicIndex , taskIndex) {
	if ( id === 'modal-topic' ) {
		document.getElementById( 'modal-task' ).style.display = 'none';
		document.getElementById( 'tasklist-editor' ).value = manager[topicIndex].topic;
		taskListToedit = topicIndex;
	} else if ( id === 'modal-task' ) {
		document.getElementById( 'modal-topic' ).style.display = 'none';
		document.getElementById( 'task-editor' ).value = manager[topicIndex].tasks[taskIndex].topic;
		taskToEdit = taskIndex;
		taskListToedit = topicIndex;
	}
	document.getElementById( id ).style.display = 'block';
}

function modalClose ( ) {
	document.getElementById( 'modal-task' ).style.display = 'none';
	document.getElementById( 'modal-topic' ).style.display = 'none';
	document.getElementById( 'task-editor' ).value = '';
	document.getElementById( 'tasklist-editor' ).value = '';
	taskToEdit = -1;
	taskListToedit = -1;
}

function saveData() {
	localStorage.setItem ( 'taskManager' , JSON.stringify(manager) );
}

window.onload = function () {

	if( localStorage.getItem ( 'taskManager' ) != null){
		manager = JSON.parse(localStorage.getItem('taskManager'));
		currentTaskList = manager.length - 1;
	}
	if( localStorage.getItem ( 'taskManagerProfile' ) != null){
		profileManager = JSON.parse ( localStorage.getItem ( 'taskManagerProfile' ) );
		document.body.style.backgroundImage = profileManager.cover;
			
	}

	retrieveTaskList();
	getCustomiser();

	// event handling for changing background images
	var customiserParent = document.getElementById ( 'customiser-parent' );
	customiserParent.onclick = function ( e ) {
		if(event.srcElement.getAttribute('class') === "back-cover") {
			var target = event.srcElement; 
			document.body.style.backgroundImage = target.style.backgroundImage;
			profileManager.cover = target.style.backgroundImage;
			localStorage.setItem( 'taskManagerProfile' , JSON.stringify ( profileManager ) );
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
			if ( action === 'delete') {
				manager.splice ( pos , 1 );
				saveData();
				card.parentNode.removeChild ( card );
				if ( pos == currentTaskList ) {
					retrieveTask ( pos );
				}
			} else if ( action == 'edit') {
				modalOpen( 'modal-topic' , pos , null);
			}
		} else {
			activateTaskList(card);
			document.getElementById ( 'taskList-topic-selected' ).innerHTML = manager[pos].topic;
			currentTaskList = pos;
			retrieveTask ( pos );
		}
	}

	// event handling for tasks
	var taskContainer = document.getElementById( 'task-container' );
	taskContainer.onclick = function (e) {
		var card = event.srcElement;
		while( card !=null  && card.getAttribute ( 'class' ) !=  'task' && card.getAttribute ( 'class' ) !=  'task task-done' ){
			var styleClass = card.getAttribute ( 'class' );
			if ( card.getAttribute ( 'class' ) === 'dashboard')
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
			if ( action === 'delete') {

				manager[currentTaskList].tasks.splice ( pos , 1 );
				saveData();
				card.parentNode.removeChild ( card );
			} else if ( action == 'edit') {
				modalOpen( 'modal-task' , currentTaskList , pos );
			} else if ( action == 'done') {
				if ( !manager[currentTaskList].tasks[pos].isDone ){
					event.srcElement.setAttribute ( 'class' , 'fa fa-check-circle done');
					card.setAttribute ( 'class' , 'task task-done');
					manager[currentTaskList].tasks[pos].isDone = true;
					saveData();
				} else {
					event.srcElement.setAttribute ( 'class' , 'fa fa-check-circle-o done');
					card.setAttribute ( 'class' , 'task');
					manager[currentTaskList].tasks[pos].isDone = false;
					saveData();
				}
			}
		}
	}

	// event handler for modal close button
	var closeTaskModal = document.getElementById('closeModal-task');
	closeTaskModal.onclick = function (e) {
		modalClose();
	}
	var closeTopicModal = document.getElementById('closeModal-topic');
	closeTopicModal.onclick = function (e) {
		modalClose();
	}

	//event for add task topic/tasklist button
	document.getElementById( 'toggle-sidebar-button' ).onclick = function (e) {
		toggleCustomiser()
	} 

	//event for add task topic/tasklist button
	document.getElementById( 'add-tasklist-button' ).onclick = function (e) {
		addTaskList();
		document.getElementById( 'newTaskListTopic' ).value = '';	
	} 

	//event for add task topic/tasklist button
	document.getElementById( 'add-task-button' ).onclick = function (e) {
		addTask();
		document.getElementById( 'newTaskContent' ).value = '';	
	} 

	//event for save button for task 
	document.getElementById('save-edited-task').onclick = function (e) {
		var editedVal = document.querySelector('#task-editor').value;
		manager[taskListToedit].tasks[taskToEdit].topic = editedVal;
		taskContainer.children[taskToEdit].querySelector('.task-content').innerHTML = editedVal;
		saveData();
		modalClose();
	}

	//event for save button for topic 
	document.getElementById('save-edited-topic').onclick = function (e) {
		var editedVal = document.querySelector('#tasklist-editor').value;
		manager[taskListToedit].topic = editedVal;
		taskListContainer.children[manager.length - 1 - taskListToedit].querySelector('.task-list-heading').innerHTML = edited;
		saveData();
		modalClose();
	}

	//toggle the sidebar containing
	document.querySelector('#toggle-right-bar-button').onclick = function (e) {
		if(leftBarShow) {
			document.querySelector('.dashboard').style.marginLeft = '0px';
			document.querySelector('.leftbar').style.left = '-300px';
			leftBarShow = false;
		} else {
			document.querySelector('.dashboard').style.marginLeft = '300px';
			document.querySelector('.leftbar').style.left = '0px';
			leftBarShow = true;
		}
	}
}



