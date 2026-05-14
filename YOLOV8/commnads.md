python -m venv env
.\env\Scripts\Activate.ps1
pip install numpy pandas opencv-python scikit-learn tensorflow pillow joblib streamlit jupyter
 
pip install jupyter jupyterlab notebook ipykernel ipywidgets

pip uninstall opencv-python-headless

pip install opencv-contrib-python

pip install numpy pandas matplotlib seaborn opencv-python pyyaml pillow ultralytics ipython

pip freeze > requirements.txt                                 
//for nvidia driver check
nvidia-smi