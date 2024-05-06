function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(0);
  l = +(l * 100).toFixed(0);

  return "hsl(" + h + "," + s + "%," + l + "%)";
}
function getbgcolor(elem, model = 'oklab') {
  var bg = elem.css('background-color'),
    bg1, arr, hex;
  if(model == 'oklab') {
    bg1 = bg.replace('oklab(','').replace(')','');
    arr = bg1.split(' ');
    hex = chroma.oklab(parseFloat(arr[0]),parseFloat(arr[1]),parseFloat(arr[2]));
  } else {
    bg1 = bg.replace('rgb(','').replace(')','');
    arr = bg1.split(' ');
    hex = chroma(parseInt(arr[0]),parseInt(arr[1]),parseInt(arr[2]))
  }
  
  return hex.toString();
}
function HSLtoArr(hsl) {
  var rmhsl = hsl.replace('hsl(','').replace(')',''),
  arr = rmhsl.split(',');
  return arr;
}
function compareHSL(hslv1, hslv2) {
  var hsl1 = HSLtoArr(hslv1), hsl2 = HSLtoArr(hslv2), h, s, l, sum;
  h = parseInt(hsl1[0]) - parseInt(hsl2[0]); 
  s = parseInt(hsl1[1]) - parseInt(hsl2[1]);
  l = parseInt(hsl1[2]) - parseInt(hsl2[2]);
  if(h<0) h = h * -1;
  if(s<0) s = s * -1;
  if(l<0) l = l * -1;
  
  sum = h + s + l; // sum<20
  // return h + ' ' + s + ' ' + l;
  if(h<5&&s<5&l<4) return true;
}
var bodycolor = getbgcolor($('body'), 'rgb'), bodyhsl = hexToHSL(bodycolor), ismixed = false;
$('.body').text(bodyhsl);
$('#dest').val(bodycolor);
$('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), myhex, myhsl, compar;
    myhex = getbgcolor(me, 'rgb');
    myhsl = hexToHSL(myhex);
    compar = compareHSL(myhsl,bodyhsl);
    if(compar) me.addClass('match');
  });
$('#dest').on('change', function(e){
  $('.match').removeClass('match');
  e.preventDefault();
  var dest = $('#dest').val();
  $('body').css('background-color', dest);
    bodycolor = getbgcolor($('body'), 'rgb');
  
  
  bodyhsl = hexToHSL(bodycolor);
  $('.body').text(bodyhsl);
  
  $('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), myhex, myhsl, compar;
    
    if(ismixed) {
    myhex = getbgcolor(me);
  } else {
    myhex = getbgcolor(me, 'rgb') ;
  }
    myhsl = hexToHSL(myhex);
    
    compar = compareHSL(myhsl,bodyhsl);
    if(compar) me.addClass('match');
  });
});
$('#hex').on('change', function(e){
  ismixed = true;
  e.preventDefault();
  $('.match').removeClass('match');
  var hex = $('#hex').val(), level = $('input[name="level"]:checked').val();
  $('label[for="hex"]>span').text('');
  $('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), myhex;
    me.css('background','color-mix(in oklab, '+v+', '+hex+' '+level+')');
  
    myhex = getbgcolor(me);
    // me.text(myhex);
    me.find('.hsl').text(hexToHSL(myhex));
    me.prev().find('.mix').text('').css('border-color','transparent');
  });
});
$('input[name="level"]').change(function() {
  
  $('.match').removeClass('match');
  var hex = $('#hex').val(), level = $('input[name="level"]:checked').val();
  $('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), myhex,myhsl;
    me.css('background','color-mix(in oklab, '+v+', '+hex+' '+level+')');
    myhex = getbgcolor(me);
    myhsl = hexToHSL(myhex);
    compar = compareHSL(myhsl,bodyhsl);
    if(compar) me.addClass('match');
    // me.text(myhex);
    me.find('.hsl').text(myhsl);
  });
});
$('.sampleswatch').on('click', function(){
  ismixed = true;
  $('.match').removeClass('match');
   var me = $(this), hex = me.next().text().trim(), nam = me.prev().find('span:first-child').text(), level = $('input[name="level"]:checked').val();
  $('#hex').val(hex);
  
  $('label[for="hex"]>span').text(nam).css('border-color',hex);
  $('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), mix = me.prev().find('.mix'), myhex, myhsl, compar;
    me.css('background','color-mix(in oklab, '+v+', '+hex+' '+level+')');
    myhex = getbgcolor(me);
    myhsl = hexToHSL(myhex);
    compar = compareHSL(myhsl,bodyhsl);
    if(compar) me.addClass('match');
    me.find('.hsl').text(myhsl);
    mix.text(''+nam).css('border-color',hex);
  });
});

$('#reset').on('click', function(){
  ismixed = false;
  $('.match').removeClass('match');
  $('#hex').val('Hex');
  $('label[for="hex"]>span').text('');
  $('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), myhsl;
    me.css('background', v);
    me.prev().find('.mix').text('');
    myhsl = hexToHSL(v);
    me.find('.hsl').text(myhsl);
  });
});

$('.sampleswatch').each(function(){
    var me = $(this), v = me.next().text().trim(), myn = me.prev().find('span[id]');
    me.html('<span class="hsl">'+hexToHSL(v)+'</span>');
  me.prev().append('<span class="mix"></span>');
  myn.css('border-color',v);
});




//  
// alert(getbgcolor($('body')));
