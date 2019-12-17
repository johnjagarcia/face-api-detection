var subscriptionKey = "189da506a93c4d1b8d25bb858ca0938c";
var url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0";
var listedPeople = null;

function init() {
  getPersonGroups();
  getPeople();
  getTrainingStatus();
}

/* Inicio servicios grupos */

function getPersonGroups() {
  $.ajax({
    url: `${url}/persongroups`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "GET"
  })
    .done(function(data) {
      $("#listGroup").val(JSON.stringify(data, null, 2));
    })
    .fail(function(err) {
      console.log("err", err);
      alert("Error obteniendo grupo de personas");
    });
}

function createPersonGroup() {
  var personGroupId = document.getElementById("inputPersonGroup").value;
  if (!personGroupId) {
    alert("Debe ingresar un nombre del grupo!");
    return;
  }

  var body = { name: personGroupId };

  $.ajax({
    url: `${url}/persongroups/${personGroupId}`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "PUT",
    // Request body
    data: JSON.stringify(body)
  })
    .done(function(data) {
      alert("Grupo creado correctamente!");
      getPersonGroups();
    })
    .fail(function(err) {
      console.log("err", err);
      alert("Error al crear grupo");
    });
}

/* Fin servicios grupos */

/* Personas */

function getPeople() {
  var personGroupId = document.getElementById("inputPersonGroupId").value;

  if (!personGroupId) {
    alert("Debe ingresar un id para cargar un grupo de personas!");
    return;
  }

  $.ajax({
    url: `${url}/persongroups/${personGroupId}/persons`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "GET"
  })
    .done(function(data) {
      listedPeople = data;
      $("#listPeople").val(JSON.stringify(data, null, 2));
    })
    .fail(function(err) {
      console.log("err", err);
      alert("Error obteniendo grupo de personas");
    });
}

function createPerson() {
  var personGroupId = document.getElementById("inputPersonGroupId").value;
  var personeName = document.getElementById("inputPersonName").value;

  if (!personGroupId) {
    alert("Debe ingresar un id de grupo!");
    return;
  }

  if (!personeName) {
    alert("Debe ingresar el nombre de la persona!");
    return;
  }

  var body = { name: personeName };

  $.ajax({
    url: `${url}/persongroups/${personGroupId}/persons`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "POST",
    // Request body
    data: JSON.stringify(body)
  })
    .done(function(data) {
      alert("Persona creada correctamente!");
      getPeople();
    })
    .fail(function(err) {
      console.log("err", err);
      alert("Error al crear la persona");
    });
}
/* Fin personas */

/* Face services */

async function addFaceToPersonByUrl() {
  var personGroupId = document.getElementById("personGroupId").value;
  var personId = document.getElementById("inputPersonId").value;
  var imageUrl = document.getElementById("imageInput").value;

  if (!personGroupId) {
    alert("Debe ingresar un id de grupo!");
    return;
  }

  if (!personId) {
    alert("Debe ingresar el Id de la persona!");
    return;
  }

  if (!imageUrl) {
    alert("Debe agregar una url con la foto a asociar");
    return;
  }

  var body = { url: imageUrl };

  $.ajax({
    url: `${url}/persongroups/${personGroupId}/persons/${personId}/persistedFaces`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "POST",
    // Request body
    data: JSON.stringify(body)
  })
    .done(function(data) {
      console.log("data", data);
      alert("Imagen agregada correctamente!");
      getPeople();
      document.getElementById("imageInput").value = "";
    })
    .fail(function(err) {
      console.log("err", err);
      alert("Error al agregar la imagen");
    });
}

async function addFaceToPersonByBinaryData(imageData) {
  var personGroupId = document.getElementById("personGroupId").value;
  var personId = document.getElementById("inputPersonId").value;

  if (!personGroupId) {
    alert("Debe ingresar un id de grupo!");
    return;
  }

  if (!personId) {
    alert("Debe ingresar el Id de la persona!");
    return;
  }

  let blobData = createBlob(imageData);

  $.ajax({
    url: `${url}/persongroups/${personGroupId}/persons/${personId}/persistedFaces`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "POST",
    // Request body
    data: blobData,
    processData: false
  })
    .done(function(data) {
      console.log("data", data);
      alert("Imagen agregada correctamente!");
      getPeople();
      document.getElementById("loadImageInput").value = "";
    })
    .fail(function(err) {
      console.log("err", err);
      alert("Error al agregar la imagen");
    });
}
/* Fin face services */

/* Training */
async function getTrainingStatus() {
  var personGroupId = document.getElementById("personGroupId").value;

  $.ajax({
    url: `${url}/persongroups/${personGroupId}/training`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "GET"
  })
    .done(function(data) {
      document.getElementById("trainingStatus").value = data.status;
    })
    .fail(function(err) {
      showAlert(err);
    });
}

async function submitTraining() {
  var personGroupId = document.getElementById("personGroupId").value;

  $.ajax({
    url: `${url}/persongroups/${personGroupId}/train`,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        `${subscriptionKey}`
      );
    },
    type: "POST"
  })
    .done(function(data) {
      getTrainingStatus();
      alert("Entrenamiento en ejecución....");
    })
    .fail(function(err) {
      showAlert(err);
    });
}
/* Fin Training */

/* Reconocimiento facial */
async function detectFace(faceData) {
  let blobData = createBlob(faceData);
  console.log("blobData", blobData);

  try {
    const detectedFaces = await $.ajax({
      url: `${url}/detect`,
      beforeSend: function(xhrObj) {
        // Request headers
        xhrObj.setRequestHeader("Content-Type", "application/octet-stream");

        xhrObj.setRequestHeader(
          "Ocp-Apim-Subscription-Key",
          `${subscriptionKey}`
        );
      },
      type: "POST",
      data: blobData,
      processData: false
    });

    if (detectedFaces && detectedFaces.length > 0) {
      console.log("detectedFace", detectedFaces);

      if (detectedFaces && detectedFaces.length > 0) {
        const faceId = detectedFaces[0].faceId;
        const identifiedPerson = await identify(faceId);

        console.log("identifiedPerson", identifiedPerson);

        if (!identifiedPerson || identifiedPerson < 1) {
          document.getElementById("detectedPeople").value =
            "No se encontraron personas asociadas";
          return;
        }

        if (listedPeople) {
          const filteredPeople = listedPeople.filter(
            people =>
              people.personId === identifiedPerson[0].candidates[0].personId
          );

          document.getElementById("recognitionState").innerHTML =
            "Reconocimiento finalizado";

          document.getElementById("detectedPeople").value =
            filteredPeople[0].name;
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function identify(faceId) {
  let body = {
    personGroupId: "linea_directa",
    faceIds: [faceId],
    maxNumOfCandidatesReturned: 1,
    confidenceThreshold: 0.5
  };

  try {
    return await $.ajax({
      url: `${url}/identify`,
      beforeSend: function(xhrObj) {
        // Request headers
        xhrObj.setRequestHeader("Content-Type", "application/json");
        xhrObj.setRequestHeader(
          "Ocp-Apim-Subscription-Key",
          `${subscriptionKey}`
        );
      },
      type: "POST",
      data: JSON.stringify(body)
    });
  } catch (error) {
    showAlert(error);
  }
}

/* fin reconocimiento facial */

function showAlert(err) {
  var responseText = JSON.parse(err.responseText);
  alert(responseText.error.message);
}

function createBlob(dataURL) {
  var BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(",");
    var contentType = parts[0].split(":")[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

window.onload = init();
