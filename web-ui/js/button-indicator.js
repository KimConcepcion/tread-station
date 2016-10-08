/**
 * Created by colin on 10/8/2016.
 */


function ButtonIndicator(options)
{
    this.options = {
      value: 1,  // the value of the button (optional)
      caption: "button",
      fill: "gray",
      stroke: null
    };
    if(options)
        $.extend(this.options, options);
}
ButtonIndicator.prototype = new DialIndicator();


ButtonIndicator.prototype.attach = function(lane)
{
    DialIndicator.prototype.attach.call(this, lane);


};








function ButtonGroupIndicator(options)
{
    this.options = {
        buttons: [],
        button_options: {
        }
    };
    if(options)
        this.options = $.extend(this.options, options);
}
ButtonGroupIndicator.prototype = new DialIndicator();


ButtonGroupIndicator.prototype.attach = function(lane)
{
    var _this = this;

    if(!this.options.lane) {
        console.log("Button group requires a 'lane' request option");
        return false;
    }
    if(this.options.buttons.length==0)
        return false;

    var button_width;
    if(this.options.button_options.width == null) {
        // buttons are evenly spaced within the group control lane range
        button_width = (this.arcrange[1]-this.arcrange[0]) / this.options.buttons.length;
    }

    var offset = this.arcrange[0];
    $.each(this.options.buttons, function(k, b) {
        var name = (b && b.name) ? b.name : "button"+k;
        var options = $.extend({}, this.button_options);

        if(!options.lane)
            options.lane = $.extend({}, _this.options.lane);

        // the user can specify buttons as a simple label list, object list or actual button references
        var button;
        if(typeof b ==="string") {
            button = new ButtonIndicator(options);
            button.name = name;
        } else if (typeof b ==="object") {
            // button was an object of options, combine with other options
            options = $.extend({}, this.button_options, b);
            button = new ButtonIndicator(options);
        }

        //options.lane.arcrange = [ offset, offset + button_width ];
        button.arcrange = [ offset, offset + button_width ];

        console.log(button);
        lane.dial.plugin(name, button);
    });
};

