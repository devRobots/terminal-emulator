const computadores = [
    {
        "hostname": "PC1",
        "IP": "192.168.0.32",
        "disco": [
            {
                "nombre": "ensayo.txt",
                "duenio": "luisa",
                "grupo": "amigos",
                "fecha": "mar 19  2020 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "grafica.jpg",
                "duenio": "joshua",
                "grupo": "ventas",
                "fecha": "abr 07  2018 22:54:00",
                "permisos": "-rw----r--"
            },
            {
                "nombre": "parcial.pdf",
                "duenio": "yesid",
                "grupo": "yesid",
                "fecha": "feb 02  2019 22:54:00",
                "permisos": "----r-----"
            },
            {
                "nombre": "hojadevida.pdf",
                "duenio": "cristian",
                "grupo": "root",
                "fecha": "ago 31  2019 22:54:00",
                "permisos": "-rwxr-----"
            }
        ],
        "usuarios": [
            "luisa",
            "joshua",
            "yes",
            "cristian",
            "root"
        ],
        "grupos": [
            {
                "nombre": "luisa",
                "usuarios": [
                    "luisa"
                ]
            },
            {
                "nombre": "joshua",
                "usuarios": [
                    "joshua"
                ]
            },
            {
                "nombre": "yesid",
                "usuarios": [
                    "yesid"
                ]
            },
            {
                "nombre": "cristian",
                "usuarios": [
                    "cristian"
                ]
            },
            {
                "nombre": "ventas",
                "usuarios": [
                    "luisa",
                    "joshua",
                    "cristian"
                ]
            },
            {
                "nombre": "amigos",
                "usuarios": [
                    "luisa",
                    "joshua",
                    "yesid"
                ]
            },
            {
                "nombre": "root",
                "usuarios": [
                    "root"
                ]
            }
        ]
    },
    {
        "hostname": "PC2",
        "IP": "192.168.0.33",
        "disco": [
            {
                "nombre": "entrega1.doc",
                "duenio": "carlos",
                "grupo": "profesores",
                "fecha": "sep 13  2020 22:54:00",
                "permisos": "-rwxrwxrwx"
            },
            {
                "nombre": "fotocedula.png",
                "duenio": "julian",
                "grupo": "supervisores",
                "fecha": "mar 05  2020 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "correccion.txt",
                "duenio": "root",
                "fecha": "nov 25  2019 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "proyecto.zip",
                "duenio": "profesores",
                "fecha": "ago 30  2019 22:54:00",
                "permisos": "-rw-r-----"
            }
        ],
        "usuarios": [
            "carlos",
            "julian",
            "andres",
            "claudia",
            "root"
        ],
        "grupos": [
            {
                "nombre": "carlos",
                "usuarios": [
                    "carlos"
                ]
            },
            {
                "nombre": "julian",
                "usuarios": [
                    "julian"
                ]
            },
            {
                "nombre": "andres",
                "usuarios": [
                    "andres"
                ]
            },
            {
                "nombre": "claudia",
                "usuarios": [
                    "claudia"
                ]
            },
            {
                "nombre": "profesores",
                "usuarios": [
                    "carlos",
                    "julian",
                    "andres",
                    "claudia"
                ]
            },
            {
                "nombre": "supervisores",
                "usuarios": [
                    "julian",
                    "andres",
                    "claudia"
                ]
            },
            {
                "nombre": "root",
                "usuarios": [
                    "root"
                ]
            }
        ]
    },
    {
        "hostname": "PC3",
        "IP": "192.168.0.34",
        "disco": [
            {
                "nombre": "formularios.doc",
                "duenio": "lina",
                "grupo": "seguimientos",
                "fecha": "dic 19  2019 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "presentacion.pdf",
                "duenio": "juan",
                "grupo": "amigos",
                "fecha": "jun 24  2020 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "seguimiento4.txt",
                "duenio": "stefania",
                "grupo": "amigos",
                "fecha": "sep 25  2020 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "modelo.pdf",
                "duenio": "angelica",
                "grupo": "angelica",
                "fecha": "oct 01  2020 22:54:00",
                "permisos": "-rw-r-----"
            }
        ],
        "usuarios": [
            "lina",
            "juan",
            "stefania",
            "angelica",
            "root"
        ],
        "grupos": [
            {
                "nombre": "lina",
                "usuarios": [
                    "lina"
                ]
            },
            {
                "nombre": "juan",
                "usuarios": [
                    "juan"
                ]
            },
            {
                "nombre": "stefania",
                "usuarios": [
                    "stefania"
                ]
            },
            {
                "nombre": "angelica",
                "usuarios": [
                    "angelica"
                ]
            },
            {
                "nombre": "seguimientos",
                "usuarios": [
                    "juan",
                    "stefania",
                    "angelica"
                ]
            },
            {
                "nombre": "amigos",
                "usuarios": [
                    "lina",
                    "juan",
                    "stefania",
                    "angelica"
                ]
            },
            {
                "nombre": "root",
                "usuarios": [
                    "root"
                ]
            }
        ]
    },
    {
        "hostname": "PC4",
        "IP": "192.168.0.35",
        "disco": [
            {
                "nombre": "finalproject.zip",
                "duenio": "camilo",
                "grupo": "proyecto",
                "fecha": "nov 03  2019 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "disenio.png",
                "duenio": "miguel",
                "grupo": "tesis",
                "fecha": "nov 21  2019 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "requisitos.txt",
                "duenio": "mario",
                "grupo": "proyecto",
                "fecha": "dic 19  2019 22:54:00",
                "permisos": "-rw-r-----"
            },
            {
                "nombre": "diploma.pdf",
                "duenio": "luis",
                "grupo": "root",
                "fecha": "ago 22  2019 22:54:00",
                "permisos": "-rw-r-----"
            }
        ],
        "usuarios": [
            "camilo",
            "miguel",
            "mario",
            "luis",
            "root"
        ],
        "grupos": [
            {
                "nombre": "camilo",
                "usuarios": [
                    "camilo"
                ]
            },
            {
                "nombre": "miguel",
                "usuarios": [
                    "miguel"
                ]
            },
            {
                "nombre": "mario",
                "usuarios": [
                    "mario"
                ]
            },
            {
                "nombre": "luis",
                "usuarios": [
                    "luis"
                ]
            },
            {
                "nombre": "proyecto",
                "usuarios": [
                    "camilo",
                    "miguel",
                    "mario"
                ]
            },
            {
                "nombre": "tesis",
                "usuarios": [
                    "miguel",
                    "mario",
                    "luis"
                ]
            },
            {
                "nombre": "root",
                "usuarios": [
                    "root"
                ]
            }
        ]
    }
]