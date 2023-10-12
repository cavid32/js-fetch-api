const ad = document.getElementById("name");
const soyad = document.getElementById("surname");
const yas = document.getElementById("age");
const yarat = document.getElementById("create-user");
const deyis = document.getElementById("edit-user");
const tbody = document.getElementById("tbody");


// yeni bos array, istifadecilerin melumatlarini yazmaq ucun
let istifadeciArr = [];


// yeni istifadeci yarada bilmek ucun asinxron funksiya
const yeniIstifadeciYarat = async () => {
    // xanalarin bos olub olmadigini yoxlamaq
  if (ad.value == "" || soyad.value == "" || yas.value == "") {
    alert("xanalari doldurun");
  } else {
    // sorgunun ugurlu olub olmamasini try-catch ile yoxlamaq
    try {
        // sorgunun unvanini, tipini, tehlukesizliyini, gonderilecek melumatlari bildirmek
      const req = await fetch("http://localhost:3000/istifadeciler", {
        method: "POST",
        headers: {
          "Content-type": "Application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          ad: ad.value,
          soyad: soyad.value,
          yas: yas.value,
        }),
      });
      // sorgumuz ugurludursa ekranda yazmaq
      if (req.ok) {
        alert("Yeni istifadeci Yarandi");
      } else {
        alert("istifadeci yaranarken xeta bas verdi");
      }
    } catch (error) {
      console.error(error);
    }
  }
};


// istifadecileri getirme ucun funksiyamiz
const istifadecileriGetir = async () => {
  try {
    const req = await fetch("http://localhost:3000/istifadeciler");
    const res = await req.json();

    // bazadan alinan melumatlari array icerisine yaymaq
    istifadeciArr = [...res];
    istifadeciGoster()
  } catch (error) {
    console.error(error);
  }
};

istifadecileriGetir();

const istifadeciGoster = () => {
    istifadeciArr.forEach((istifadeci, index)=>{
        tbody.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${istifadeci.ad}</td>
                <td>${istifadeci.soyad}</td>
                <td>${istifadeci.yas}</td>
                <td>
                    <button onclick='istifadeciDuzelt(${istifadeci.id})'>Duzelt</button>
                </td>
                <td>
                    <button onclick='istifadeciSil(${istifadeci.id})'>Sil</button>
                </td>

            </tr>
        `;
    })
}


// istifadecileri silmek ucun funksiya
const istifadeciSil = async (id) => {
    // buttondan funksiyaya gonderilen id esasinda try catch ile sorgunu gondermek
  try {
    const req = await fetch(`http://localhost:3000/istifadeciler/${id}`, {
      method: "DELETE",
    });
    if (req.ok) {
      alert("istifadeci silindi");
    } else {
      alert("istifadeci silinerken xeta bas verdi");
    }
  } catch (error) {
    console.error(error);
  }
};


// buttondan kliklendikde cagirilan funksiya, bu funksiya hazirki array icerisinden idsi eyni olani tapib deyerleri ekranda yazir
const istifadeciDuzelt = (gonderilenId) => {
  const tapilanIstifadeci = istifadeciArr.find((herBirIstifaedci) => herBirIstifaedci.id == gonderilenId)
  if (tapilanIstifadeci) {
    ad.value = tapilanIstifadeci.ad;
    soyad.value = tapilanIstifadeci.soyad;
    yas.value = tapilanIstifadeci.yas;
    yarat.style.display = "none";
    deyis.style.display = 'inline';
    deyis.setAttribute('user-id', tapilanIstifadeci.id)
  }
};


// ekranda yazilmis deyerleri, bazaya gondermek
// hansi istifadecini yenileyeceyimizi, buttona yazilmis user-id atributundan almaq
const istifadeciniYenile = async () => {
    try {
        const req = await fetch(`http://localhost:3000/istifadeciler/${deyis.getAttribute('user-id')}`, {
            method:'PUT', 
            headers: {
                "Content-type": "Application/json;charset=UTF-8",
              },
              body:JSON.stringify({
                ad:ad.value, 
                soyad:soyad.value,
                yas:yas.value
              })
        })
        if (req.ok) {
            alert("istifadeci melumatlari yenilendi")
        }else{
            alert('melumatlar yenilenerken xeta bas verdi')
        }
    } catch (error) {
        console.error(error);
    }
}


deyis.addEventListener('click', istifadeciniYenile)
yarat.addEventListener("click", yeniIstifadeciYarat);
