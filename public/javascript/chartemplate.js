(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['card-template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div class=\"card text-center col-md-4 col-md-offset-4\" id="
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " style=\"max-width: 275px;\">\r\n            <div class=\"card-block\">\r\n                <h4 class=\"card-title\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\r\n                <h6 class=\"card-subtitle\">Location:\r\n                              "
    + alias4(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data}) : helper)))
    + "</h6>\r\n            </div>\r\n            <div class=\"card-block\">\r\n                <h6 class=\"saving loading card-title text-muted\">\r\n                    Waiting<span>.</span><span>.</span><span>.</span>\r\n                </h6>\n                <span class=\"ready-value\">\n                    <span class=\"card-title\" id=\""
    + alias4(((helper = (helper = helpers.returndata || (depth0 != null ? depth0.returndata : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"returndata","hash":{},"data":data}) : helper)))
    + "\"></span>\n                    <span class=\"card-title\">"
    + alias4(((helper = (helper = helpers.unitvalue || (depth0 != null ? depth0.unitvalue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"unitvalue","hash":{},"data":data}) : helper)))
    + "</span>\n                </span>\r\n            </div>\r\n            <div class=\"card-block\">\r\n                <p class=\"card-text\">\r\n                    "
    + alias4(((helper = (helper = helpers.cardtext || (depth0 != null ? depth0.cardtext : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cardtext","hash":{},"data":data}) : helper)))
    + "\r\n                </p>\r\n                <button type=\"button\" class=\"btn btn-secondary col-md-12\" id=\""
    + alias4(((helper = (helper = helpers.buttonValue || (depth0 != null ? depth0.buttonValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonValue","hash":{},"data":data}) : helper)))
    + "\">\r\n                    <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\r\n                </button>\r\n                <script>\r\n                $('#"
    + alias4(((helper = (helper = helpers.buttonValue || (depth0 != null ? depth0.buttonValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonValue","hash":{},"data":data}) : helper)))
    + "').click(function() {\r\n                    $('#"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "').remove()\r\n                })\r\n                </script>\r\n            </div>\r\n        </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.cards : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();
