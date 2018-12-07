var transporter = require("../config/transporter");
var mailer = {
  sampleEmail: function(to) {
    return transporter.sendMail({
      from: "'Bloodmap' <request@bloodmap.com>",
      to: to,
      subject: "New Blood Request",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id finibus nibh. Cras vitae aliquet enim. Vivamus vel suscipit leo. Duis sed porta augue, facilisis eleifend mauris. Morbi in maximus neque. Mauris ac dolor dui. Nullam varius justo ut turpis aliquam, condimentum iaculis leo porttitor. Morbi arcu tellus, placerat a velit nec, fringilla efficitur ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    });
  }
};

module.exports = mailer;
