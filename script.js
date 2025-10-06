let draggedClass = null; // "big" or "small"
let currentHygienePercent = 0; // defined globally, only once
let currentComfortPercent = 0; // defined globally, only once
let currentSportsPercent = 0; // defined globally, only once
let currentScientificPercent = 0;
let currentWeightPercent = 0;
let finalScore = 0;

let smallWeight = 9;
let bigWeight = 12;

let isOverweight = false;


//CATALOG STATS//
const stats = {

  //SPORTS //
  basic_treadmill: {
    type: 'sports',
    score : 25,
    weight: bigWeight,
    class: 'big'
  },
  ARED: {
    type: 'sports',
    score: 20,
    weight: bigWeight,
    class: 'big'
  },
  cycle_ergometer: {
    type: 'sports',
    score: 33,
    weight: smallWeight,
    class: 'small'
  },

  //KITCHEN //
  beverage_bags: {
    type: 'hygiene',
    score: 5,
    weight: smallWeight
  },
  eating_utensils: {
    type: 'hygiene',
    score: 2,
    weight: smallWeight
  },
  food_packs: {
    type: 'hygiene',
    score: 8,
    weight: smallWeight
  },
  food_warmer: {
    type: 'hygiene',
    score: 7,
    weight: smallWeight
  },
  water_dispenser: {
    type: 'hygiene',
    score: 8,
    weight: smallWeight
  },


  //LABORATORY//
  glove_box: {
    type: 'scientific',
    score: 25,
    weight: smallWeight
  },
  research_workstation: {
    type: 'scientific',
    score: 33,
    weight: bigWeight
  },
  sample_storage_unit: {
    type: 'scientific',
    score: 15,
    weight: bigWeight
  },

  //OXYGEN//
  CO2_removal_assembly: {
    type: 'hygiene',
    score: 8,
    weight: smallWeight
  },
  oxygen_generation_system: {
    type: 'hygiene',
    score: 8,
    weight: bigWeight
  },
  oxygen_storage_tank: {
    type: 'hygiene',
    score: 8,
    weight: bigWeight
  },

  // ROOM/DESCANSO //
  dormitorio_espacial: {
    type: 'comfort',
    score: 16,
    weight: bigWeight
  },

  temperature_regulator: {
    type: 'comfort',
    score: 13,
    weight: smallWeight
  },

  ventilation_system: {
    type: 'comfort',
    score: 8,
    weight: smallWeight
  },



  //HYGIENE//
  big_toilet: {
    type: 'hygiene',
    score: 8,
    weight: bigWeight,
    class: 'big'
  },

  health_monitoring_system: {
    type: 'hygiene',
    score: 6,
    weight: smallWeight,
    class: 'small'
  },

  dental_hygiene_kit: {
    type: 'hygiene',
    score: 3,
    weight: smallWeight,
    class: 'small'
  },

  trash_can: {
    type: 'hygiene',
    score: 5,
    weight: smallWeight,
    class: 'small'
  },

  //COMODIDADES//
  personal_locker: {
    type: 'comfort',
    score: 16,
    weight: bigWeight
  },

  consola_de_comunicacion: {
    type: 'comfort',
    score: 12,
    weight: smallWeight
  },

  panel_de_luz: {
    type: 'comfort',
    score: 8,
    weight: smallWeight
  }
}




// Make images draggable and track their class
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("dragstart", e => {
    draggedClass = e.target.classList.contains("big") ? "big" : "small";
    e.dataTransfer.setData("text", e.target.id);

    // Highlight valid drop targets
    document.querySelectorAll(".drop").forEach(drop => {
      if (draggedClass === "small") {
        // Small images can go in any drop
        drop.classList.add("highlight");
      } else if (draggedClass === "big" && drop.classList.contains("big")) {
        // Big images only highlight big drops
        drop.classList.add("highlight");
      }
    });
  });

  img.addEventListener("dragend", e => {
    // Remove highlights when drag ends
    document.querySelectorAll(".drop").forEach(drop => drop.classList.remove("highlight"));
  });
});

// Drop behavior
document.querySelectorAll(".drop").forEach(drop => {
  drop.addEventListener("dragover", e => e.preventDefault());

  drop.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const dragged = document.getElementById(id);
    const children = Array.from(drop.children);
    // Only allow drop if valid
    if (
      (draggedClass === "small" && children.length < 1) || 
      (draggedClass === "big" && drop.classList.contains("big") && children.length < 1)
    )

    if (currentWeightPercent >= 100) {
      alert("The spaceship is too heavy!");
      return;
    }
    {
      console.log("lk")
      drop.appendChild(dragged);
    }
  });
});

function dragstartHandler(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const dragged = document.getElementById(data);
  const drop = ev.target;

  if (!drop.classList.contains("drop")) return; // only valid zones

  const draggedClass = dragged.classList.contains("big") ? "big" : "small";
  const children = Array.from(drop.children);
  const smallChildren = children.filter(c => c.classList.contains("small"));
  const bigChildren = children.filter(c => c.classList.contains("big"));

  if (currentWeightPercent >= 100) {
    return;
  }

  // ❌ prevent big images in small drops
  if (drop.classList.contains("small") && draggedClass === "big") {
    alert("You can't drop a big image in a small zone!");
    return;
  }

  // 🟡 small drop: only 1 small
  if (drop.classList.contains("small") && smallChildren.length >= 1) {
    alert("This small drop is already full!");
    return;
  }

  // 🟢 big drop: either 1 big OR up to 2 smalls (not both)
  if (drop.classList.contains("big")) {
    // If it already has a big, no more
    if (bigChildren.length >= 1) {
      alert("This big drop already has a big image!");
      return;
    }

    // If it already has any bigs, don't allow smalls
    if (bigChildren.length > 0 && draggedClass === "small") {
      alert("This big drop already has a big image — can't add smalls!");
      return;
    }

    // If it already has any smalls, don't allow bigs
    if (smallChildren.length > 0 && draggedClass === "big") {
      alert("This big drop already has small images — can't add a big one!");
      return;
    }

    // If already 2 smalls, no more
    if (draggedClass === "small" && smallChildren.length >= 2) {
      alert("This big drop already has 2 small images!");
      return;
    }
  }
  if (currentWeightPercent >= 100){
    return;
  }

  // ✅ valid drop

  addToCriteria(dragged.id);
  console.log("here")
  drop.appendChild(dragged);
}


//MENU BUTTON LOGIC//
const button = document.getElementById("hygiene_button");
const div = document.getElementById("hygiene_images");

// Add a click event listener to the button
button.addEventListener("click", () => {
  if (div.style.display === "none" || div.style.display === "") {
    div.style.display = "block"; // show the div
  } else {
    div.style.display = "none"; // hide the div
  }
});

const button_kitchen = document.getElementById("kitchen_button");
const div_kitchen = document.getElementById("kitchen_images");

// Add a click event listener to the button
button_kitchen.addEventListener("click", () => {
  if (div_kitchen.style.display === "none" || div_kitchen.style.display === "") {
    div_kitchen.style.display = "block"; // show the div
  } else {
    div_kitchen.style.display = "none"; // hide the div
  }
});

const button_exercise = document.getElementById("exercise_button");
const div_exercise = document.getElementById("exercise_images");

// Add a click event listener to the button
button_exercise.addEventListener("click", () => {
  if (div_exercise.style.display === "none" || div_exercise.style.display === "") {
    div_exercise.style.display = "block"; // show the div
  } else {
    div_exercise.style.display = "none"; // hide the div
  }
});

const button_oxygen = document.getElementById("oxygen_button");
const div_oxygen = document.getElementById("oxygen_images");

// Add a click event listener to the button
button_oxygen.addEventListener("click", () => {
  if (div_oxygen.style.display === "none" || div_oxygen.style.display === "") {
    div_oxygen.style.display = "block"; // show the div
  } else {
    div_oxygen.style.display = "none"; // hide the div
  }
});

const button_lab = document.getElementById("lab_button");
const div_lab = document.getElementById("lab_images");

// Add a click event listener to the button
button_lab.addEventListener("click", () => {
  if (div_lab.style.display === "none" || div_lab.style.display === "") {
    div_lab.style.display = "block"; // show the div
  } else {
    div_lab.style.display = "none"; // hide the div
  }
});

const button_room = document.getElementById("room_button");
const div_room = document.getElementById("room_images");

// Add a click event listener to the button
button_room.addEventListener("click", () => {
  if (div_room.style.display === "none" || div_room.style.display === "") {
    div_room.style.display = "block"; // show the div
  } else {
    div_room.style.display = "none"; // hide the div
  }
});

const button_reunion = document.getElementById("reunion_button");
const div_reunion = document.getElementById("reunion_images");

// Add a click event listener to the button
button_reunion.addEventListener("click", () => {
  if (div_reunion.style.display === "none" || div_reunion.style.display === "") {
    div_reunion.style.display = "block"; // show the div
  } else {
    div_reunion.style.display = "none"; // hide the div
  }
});



function setHygieneBarRatio(orangePercent) {
  const bar = document.getElementById("hygiene_bar_background");
  if (!bar) return;

  // Add new value to current percent
  currentHygienePercent += orangePercent;

  // Clamp to 100%
  if (currentHygienePercent > 100) currentHygienePercent = 100;

  bar.style.background = `linear-gradient(
    to right,
    #1D2B58 0%,
    #1D2B58 ${currentHygienePercent}%,
    white ${currentHygienePercent}%,
    white 100%
  )`;
}

function setScientificBarRatio(orangePercent) {
  const bar = document.getElementById("scientific_bar_background");
  if (!bar) return;

  // Add new value to current percent
  currentScientificPercent += orangePercent;

  // Clamp to 100%
  if (currentScientificPercent > 100) currentScientificPercent = 100;

  bar.style.background = `linear-gradient(
    to right,
    #1D2B58 0%,
    #1D2B58 ${currentScientificPercent}%,
    white ${currentScientificPercent}%,
    white 100%
  )`;

}

function setSportsBarRatio(orangePercent) {
  const bar = document.getElementById("sports_bar_background");
  if (!bar) return;

  // Add new value to current percent
  currentSportsPercent += orangePercent;

  // Clamp to 100%
  if (currentSportsPercent > 100) currentSportsPercent = 100;


  // Update the bar
  bar.style.background = `linear-gradient(
    to right,
    #1D2B58 0%,
    #1D2B58 ${currentSportsPercent}%,
    white ${currentSportsPercent}%,
    white 100%
  )`;
}


function setComfortBarRatio(orangePercent) {
  const bar = document.getElementById("comfort_bar_background");
  if (!bar) return;

  // Add new value to current percent
  currentComfortPercent += orangePercent;

  // Clamp to 100%
  if (currentComfortPercent > 100) currentComfortPercent = 100;

  // Update the bar
  bar.style.background = `linear-gradient(
    to right,
    #1D2B58 0%,
    #1D2B58 ${currentComfortPercent}%,
    white ${currentComfortPercent}%,
    white 100%
  )`;
}

function setWeight(orangePercent, item) {
  const bar = document.getElementById("weight_bar_background");
  if (!bar) return;

  if (currentWeightPercent + orangePercent > 100) {
    alert("The spaceship is too heavy!");
    isOverweight = true;
  }
  // Add new value to current percent
  currentWeightPercent += orangePercent;


  // Update the bar
  bar.style.background = `linear-gradient(
    to right,
    #1D2B58 0%,
    #1D2B58 ${currentWeightPercent}%,
    white ${currentWeightPercent}%,
    white 100%
  )`;
}


function addToCriteria(item) {
  if (!stats[item]) return;

  if (stats[item].type === 'comfort') {
    setComfortBarRatio(stats[item].score);
  }
  if (stats[item].type === 'scientific') {
    setScientificBarRatio(stats[item].score);
  }
  if (stats[item].type === 'hygiene') {
    setHygieneBarRatio(stats[item].score);
  }
  if (stats[item].type == 'sports') {
    setSportsBarRatio(stats[item].score);
  }
  setWeight(stats[item].weight, item);

}

//Miguel was here



document.querySelectorAll("img[data-desc]").forEach(img => {
  const descText = img.getAttribute("data-desc");
  const desc = document.createElement("div");
  desc.className = "desc-box";
  desc.textContent = descText;
  document.body.appendChild(desc);

  let hoverTimer;
  let lastX = 0, lastY = 0;
  let showing = false;

  img.addEventListener("mouseenter", (e) => {
    const rect = img.getBoundingClientRect();
    desc.style.left = rect.left + rect.width / 2 + "px";
    desc.style.top = rect.top - 10 + "px";

    lastX = e.clientX;
    lastY = e.clientY;

    hoverTimer = setTimeout(() => {
      desc.style.opacity = "1";
      showing = true;
    }, 500); // 0.5s delay
  });

  img.addEventListener("mousemove", (e) => {
    const moved = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (moved > 5 && !showing) {
      clearTimeout(hoverTimer);
      lastX = e.clientX;
      lastY = e.clientY;
      hoverTimer = setTimeout(() => {
        desc.style.opacity = "1";
        showing = true;
      }, 500);
    }
  });

  img.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    desc.style.opacity = "0";
    showing = false;
  });
});
// Store each image's original parent at the start
const images = document.querySelectorAll("img");
const originalParents = new Map();

images.forEach(img => {
  originalParents.set(img.id, img.parentElement);
});

// Create the Reset button (optional if you already have one)
const resetBtn = document.getElementById("resetBtn");

// Reset logic
resetBtn.addEventListener("click", () => {
  document.querySelectorAll("img").forEach(img => {
    const originalParent = originalParents.get(img.id);
    if (originalParent) originalParent.appendChild(img);
  });



});

// Reset logic
resetBtn.addEventListener("click", () => {
  const weight_bar = document.getElementById("weight_bar_background");
  const fitness_bar = document.getElementById("sports_bar_background");
  const comfort_bar = document.getElementById("comfort_bar_background");
  const health_bar = document.getElementById("hygiene_bar_background");
  const science_bar = document.getElementById("scientific_bar_background");

  images.forEach(img => {
    const originalParent = originalParents.get(img.id);
    if (originalParent) {
      originalParent.appendChild(img);
    }

      currentHygienePercent = 0; // defined globally, only once
      currentComfortPercent = 0; // defined globally, only once
      currentSportsPercent = 0; // defined globally, only once
      currentScientificPercent = 0;
      currentWeightPercent = 0;
      currentTotalPercent = 0;
      isOverweight = false;

     weight_bar.style.background = `linear-gradient(
    to right,
    orange 0%,
    orange 0%,
    white 0%,
    white 100%
    )`;

     fitness_bar.style.background = `linear-gradient(
    to right,
    orange 0%,
    orange 0%,
    white 0%,
    white 100%
    )`;

     comfort_bar.style.background = `linear-gradient(
    to right,
    orange 0%,
    orange 0%,
    white 0%,
    white 100%
    )`;

     health_bar.style.background = `linear-gradient(
    to right,
    orange 0%,
    orange 0%,
    white 0%,
    white 100%
    )`;

     science_bar.style.background = `linear-gradient(
    to right,
    orange 0%,
    orange 0%,
    white 0%,
    white 100%
    )`;


  });
});




document.getElementById("submit_btn").addEventListener("click", function() {
  finalScore = currentComfortPercent + currentHygienePercent + currentScientificPercent + currentSportsPercent;

  if (isOverweight == true) {
    alert("Your spaceship is too heavy!");
    return;
  }

  if (finalScore <= 25) {
    alert("Your spaceship is not suitable for space travel.");
  }

  if (finalScore > 25 && finalScore <= 75) {
    alert("Some systems work, but it’s still too risky to launch.");
  }

  if (finalScore > 75 && finalScore <= 100) {
    alert("The essentials are there, but the design needs serious fine-tuning.");
  }

  if (finalScore > 100 && finalScore <= 125) {
    alert("A decent design — reliable, but not exceptional.");
  }

  if (finalScore > 125) {
    window.location.href = 'index_4.html';
    alert("Your design is efficient, safe, and comfortable — a model for future space colonies.");
  }


});




//BUTTON ACTIVATED //

  const my_hygiene_button = document.getElementById('hygiene_button');
  let isPurple = true; // initial state

  my_hygiene_button.addEventListener('click', () => {
    if (isPurple) {
      my_hygiene_button.style.border = '5px solid #646787';
    } else {
      my_hygiene_button.style.border = 'none';
    }
    isPurple = !isPurple; // toggle state
  });


  const my_kitchen_button = document.getElementById('kitchen_button');
  let isPurple1 = true; // initial state

  my_kitchen_button.addEventListener('click', () => {
    if (isPurple1) {
      my_kitchen_button.style.border = '5px solid #646787';
    } else {
      my_kitchen_button.style.border = 'none';
    }
    isPurple1 = !isPurple1; // toggle state
  });

  const my_exercise_button = document.getElementById('exercise_button');
  let isPurple2 = true; // initial state

  my_exercise_button.addEventListener('click', () => {
    if (isPurple2) {
      my_exercise_button.style.border = '5px solid #646787';
    } else {
      my_exercise_button.style.border = 'none';
    }
    isPurple2 = !isPurple2; // toggle state
  });

  const my_lab_button = document.getElementById('lab_button');
  let isPurple3 = true; // initial state

  my_lab_button.addEventListener('click', () => {
    if (isPurple3) {
      my_lab_button.style.border = '5px solid #646787';
    } else {
      my_lab_button.style.border = 'none';
    }
    isPurple3 = !isPurple3; // toggle state
  });

  const my_oxygen_button = document.getElementById('oxygen_button');
  let isPurple4 = true; // initial state

  my_oxygen_button.addEventListener('click', () => {
    if (isPurple4) {
      my_oxygen_button.style.border = '5px solid #646787';
    } else {
      my_oxygen_button.style.border = 'none';
    }
    isPurple4 = !isPurple4; // toggle state
  });

    const my_rest_button = document.getElementById('room_button');
  let isPurple5 = true; // initial state

  my_rest_button.addEventListener('click', () => {
    if (isPurple5) {
      my_rest_button.style.border = '5px solid #646787';
    } else {
      my_rest_button.style.border = 'none';
    }
    isPurple5 = !isPurple5; // toggle state
  });

      const my_reunion_button = document.getElementById('reunion_button');
  let isPurple6 = true; // initial state

  my_reunion_button.addEventListener('click', () => {
    if (isPurple6) {
      my_reunion_button.style.border = '5px solid #646787';
    } else {
      my_reunion_button.style.border = 'none';
    }
    isPurple6 = !isPurple6; // toggle state
  });



  