(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['card-template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"card text-center col-md-4 col-md-offset-4\" id= "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " style=\"max-width: 275px;\">\n        <div class=\"card-block\">\n            <h4 class=\"card-title\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\n            <h6 class=\"card-subtitle\">Location:\n                              "
    + alias4(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data}) : helper)))
    + "</h6>\n            <h6 class=\"saving loading card-title text-muted\">\n                    Waiting<span>.</span><span>.</span><span>.</span>\n                </h6>\n            <span class=\"ready-value\">\n                <canvas style=\"min-height:150px;\" id=\""
    + alias4(((helper = (helper = helpers.canvasID || (depth0 != null ? depth0.canvasID : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"canvasID","hash":{},"data":data}) : helper)))
    + "\"></canvas>\n                <span class=\"card-title\" id=\""
    + alias4(((helper = (helper = helpers.returndata || (depth0 != null ? depth0.returndata : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"returndata","hash":{},"data":data}) : helper)))
    + "\"></span>\n                <span class=\"card-title\">"
    + alias4(((helper = (helper = helpers.unitvalue || (depth0 != null ? depth0.unitvalue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"unitvalue","hash":{},"data":data}) : helper)))
    + "</span>\n            </span>\n            <p class=\"card-text\">\n                "
    + alias4(((helper = (helper = helpers.cardtext || (depth0 != null ? depth0.cardtext : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cardtext","hash":{},"data":data}) : helper)))
    + "\n            </p>\n            <button type=\"button\" class=\"btn btn-secondary col-md-12\" id=\""
    + alias4(((helper = (helper = helpers.buttonValue || (depth0 != null ? depth0.buttonValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonValue","hash":{},"data":data}) : helper)))
    + "\">\n                    <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n                </button>\n            <script>\n                $('#"
    + alias4(((helper = (helper = helpers.buttonValue || (depth0 != null ? depth0.buttonValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonValue","hash":{},"data":data}) : helper)))
    + "').click(function() {\n                	$('#"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "').remove()\n                	let newWarning = {\n                		title: $('#title-input').val(),\n                		compare: $('#operator-select').val(),\n                		warning: $('#warning-input').val(),\n                	}\n                	$.ajax({\n                		type: 'DELETE',\n                		data: JSON.stringify(newWarning),\n                		url: './add-warn',\n                		contentType: 'application/json',\n                	})\n                })\n            </script>\n        </div>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.cards : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();