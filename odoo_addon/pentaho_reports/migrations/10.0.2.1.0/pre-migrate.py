# -*- coding: utf-8 -*-


def migrate(cr, version):
    """Update database from previous versions, after updating module."""
    return True

    cr.execute(
        """
        ALTER TABLE ir_act_report_xml ADD COLUMN pentaho_context text
        """
    )

