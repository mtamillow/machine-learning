/**
 * valid_float.js: check if provided argument is float type.
 */
function validator(value) {
  // invalid condition: -0, and -0.0
  if (value.match(/^-0*.0*$/)) {
    return false;
  }
  // validate integers: cannot start with 0 (except trivial 0)
  else if (value.match(/^-?(0|[1-9][0-9]*)$/)) {
    return true;
  // validate floats: cannot start with 0 (except trivial 0.x)
  } else if (value.match(/^-?(0|[1-9][0-9]*)?\.\d+$/)) {
    return true;
  // invalid condition: general
  } else {
    return false;
  }
}

export default function checkValidFloat(value) {
  return validator(value);
}