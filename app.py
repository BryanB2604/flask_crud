from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

jugadores = []


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ingresar/<nombre>', methods = ['POST'])
def ingresar_informacion(nombre, id, edad, nacionalidad):
    if request.method == 'POST':
        nombre = request.form = ['name']
        id = request.form = ['cedula']
        edad =request.form = ['edad']
        nacionalidad = request.form = ['nacionalidad']
        
        return redirect(url_for('index')), 'Se ingreso la informacion correctamente'
    else:
        return 'Los datos no se ingresaron correctamente.'

if __name__ == '__main__':
    app.run(debug = True)