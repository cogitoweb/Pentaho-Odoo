## Installare Tomcat

	sudo apt-get update
	sudo apt-get install tomcat7


## Tomcat come servizio

	sudo service tomcat7 start|stop|status|restart


## Installare Report Server
Scaricare il file precompilato 'pentaho-reports-for-openerp.war'.
Se il link è offline, in questo repo è presente una copia del file (aggiornato al 2017-09-22).

	cd /tmp
	wget http://cloud1.willowit.com.au/dist/pentaho-reports-for-openerp.war

Inserire il file scaricato nella cartella 'webapps' e rinominarlo in 'pentaho-reports-for-odoo.war'

	mv pentaho-reports-for-openerp.war /var/lib/tomcat7/webapps/pentaho-reports-for-odoo.war

Riavviare Tomcat dopo la copia del file.

	sudo service tomcat7 restart


## Installazione modulo Pentaho-Odoo
Scaricare il repository

	git clone https://github.com/WilldooIT/Pentaho-Odoo.git

Spostare e rinominare la cartella 'odoo_addon' in una cartella accessibile da Odoo

	mv odoo_addon /srv/odoo/10.0/buildout/parts/pentaho

Aggiornare l'addon-path di Odoo se necessario. Riavviare Odoo, aggiornare la lista delle apps ed installare il modulo 'Pentaho Reports for Odoo'

**Nota:** al momento solo i report SQL funzionano.


## Configurazione modulo Pentaho-Odoo
I parametri di configurazione del modulo si trovano in Odoo > Settings > Parameters > System Parameters

URL del Report Server

	pentaho.server.url

Dettagli per connessione al database tramite XML-RPC

	pentaho.odoo.xml.interface
	pentaho.odoo.xml.port

Dettagli per connessione al database tramite Query SQL

	pentaho.postgres.host
	pentaho.postgres.port
	pentaho.postgres.login
	pentaho.postgres.password


## Definizione report Pentaho
I report sono definiti in Odoo > Settings > Actions > Reports

	{
		'name': nome del report,
		'pentaho_report_model_id': modello a cui il report è collegato
		'linked_menu_id': menu da dove richiamare il wizard
		'report_type': 'pentaho',
		'pentaho_report_output_type': 'pdf',
		'pentaho_file': file .prpt
		'report_name': nome del file di output
	}

E' possibile dichiarare un report tramite XML, settando 'pentaho_load_file=True' e specificando il percorso del file .prpt

	<record id="" model="ir.actions.report.xml">
		<field name="name"></field>
		<field name="model"></field>
		<field name="pentaho_report_model_id" ref=""/>
		<field name="linked_menu_id" ref=""/>
		<field name="report_type">pentaho</field>
		<field name="pentaho_report_output_type">pdf</field>
		<field name="report_name"></field>

		<field name="pentaho_filename">/path/to/your_report_template.prpt</field>
		<field name="pentaho_load_file" eval="True"/>
	</record>


## Related links
https://github.com/WilldooIT/Pentaho-Odoo