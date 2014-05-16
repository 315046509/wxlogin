$(document).ready(quizInit);

function quizInit(){
	//问题表单
	var quiz_form = $('#form_quiz');
	
	//问题列表
	var quiz_questions = $("#form_quiz div.quiz_list").each(function(i, div){
		$(div).attr('quiz_index',i);
	}).hide();	
	
	//问题快捷菜单
	var short_list = $("#quiz_finished li").each(function(i, li){
		$(li).attr('quiz_index',i);
	});	

	var finished_quiz = new Array(quiz_questions.length);	//已完成问题
	var current_quiz = $(quiz_questions.get(0));	//当前问题
	
	var canSubmit = false;	//可提交
	var tipInfo = '';	//提示信息
	var firstUnSelected = 1;	//第一个未选题目
	var fading = true;	//切换中
	
	checkSubmit();
	fadeInQuiz(firstUnSelected-1);

	//切换试题
	$('#quiz_finished').bind('click',function(e){
		if(!fading){
			fading = true;
		
			var ele = e.target;
			if(ele.nodeName === 'A'){
				ele = ele.parentNode;
			}
			
			if(ele.nodeName === 'LI'){
				var index = $(ele).attr('quiz_index');
				current_quiz.hide();
				fadeInQuiz(index);
				return false;
			}
		}
	});
	
	//提交表单
	 $('.btn_submit_quiz').click(function(){
		if(!canSubmit){
			confirmDialog();
		}else{
			quiz_form[0].submit();

		}
	 });
	
	//下一题
	quiz_questions.find('a').click(function(e){
		var index = parseInt($(this).parent().attr('quiz_index')) + 1;
		current_quiz.hide();
		fadeInQuiz(index);
		return false;
	});
	
	//弹窗
	function confirmDialog(){
			window.scrollTo(0,0);
			var d = new Boxy('<p class="qustBoxyCont" style="padding-top:5px;">第 <strong>'+tipInfo+'</strong> 题还没有选，可能会影响测试结果！是否继续？<br /><br /></p><p class="qustBoxyCont qustBoxyContButton"><a class="goToqustion" href="#"><span></span>前往第'+firstUnSelected+'题</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/babies/quizs/result"><span></span>直接查看结果</a></p>', {title: '早教评测',modal:true});
			d.boxy.attr('id','quiz_test');
			
			var btns = d.getContent().find("a");
			$(btns[0]).click(function(){
				d.hide().unload();
				current_quiz.hide();
				fadeInQuiz(firstUnSelected-1);
				return false;
			});
			$(btns[1]).click(function(){
				quiz_form[0].submit();
                return false;
			});
	}
	
	
	//选择试题
	$("#form_quiz div.quiz_list li input").click(function(e){
		var ele = $(e.target).parents('div.quiz_list').get(0);
		var index = $(ele).attr('quiz_index');
		$(short_list.get(index)).addClass('quiz_complete');
		finished_quiz[index] = true;
		checkSubmit();
	});	
	
	//切换结束
	function fadeComplete(){
		fading = false;
	}
	
	//淡入
	function fadeInQuiz(index){
		//var index = index || quiz_questions.size() - 1;
		current_quiz = $(quiz_questions.get(index));
		current_quiz.fadeIn(fadeComplete);
	}
	
	//测试完成检测
	function checkSubmit(){
		var strs = [];
		canSubmit = true;
	
		quiz_questions.each(function(i,ele){
			var inputs = $(ele).find('input:checked').size();
			if(inputs > 0){
				finished_quiz[i] = true;
				$(short_list[i]).addClass('quiz_complete');
			} else{
				finished_quiz[i] = false;
				strs.push(i+1);
				$(short_list[i]).removeClass('quiz_complete');
				canSubmit = false;
			}
		});
	
		tipInfo = strs.join('、');
		firstUnSelected = strs[0] || 1;
	}
	
}
